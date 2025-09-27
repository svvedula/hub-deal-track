import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client with service role for database operations
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Verify user token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const { bankStatementData, filename } = await req.json();
    console.log('Processing bank statement for user:', user.id);

    let bankStatementText = '';
    
    // Handle different file types
    if (filename?.toLowerCase().endsWith('.pdf')) {
      try {
        // For now, ask user to convert PDF to text format
        throw new Error('PDF files are not currently supported. Please convert your PDF to a CSV or TXT file and try again. You can use online tools like "PDF to Text" converters or copy-paste the content from your PDF.');
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        throw pdfError;
      }
    } else {
      // For CSV/TXT files, use the text directly
      bankStatementText = bankStatementData;
    }

    // Create bank statement record
    const { data: bankStatement, error: insertError } = await supabase
      .from('bank_statements')
      .insert({
        user_id: user.id,
        filename: filename,
        processing_status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating bank statement record:', insertError);
      throw new Error('Failed to create bank statement record');
    }

    console.log('Created bank statement record:', bankStatement.id);

    // Analyze with OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a financial analyst AI that extracts transaction data from bank statements and provides spending insights. 
            
            Analyze the bank statement text and return a JSON response with this exact structure:
            {
              "transactions": [
                {
                  "date": "YYYY-MM-DD",
                  "description": "Transaction description",
                  "amount": 123.45,
                  "transaction_type": "income" or "expense",
                  "category": "food", "transportation", "utilities", "entertainment", "shopping", "healthcare", "business", "other",
                  "merchant": "Merchant name if identifiable"
                }
              ],
              "insights": [
                {
                  "type": "spending_category" | "cost_cutting" | "revenue_opportunity" | "cash_flow",
                  "title": "Insight title",
                  "description": "Detailed description",
                  "potential_savings": 123.45,
                  "priority": "high" | "medium" | "low"
                }
              ],
              "summary": {
                "total_income": 1000.00,
                "total_expenses": 800.00,
                "net_cash_flow": 200.00,
                "top_spending_categories": ["food", "transportation"],
                "unusual_transactions": ["Any unusual spending patterns"]
              }
            }`
          },
          {
            role: 'user',
            content: `Please analyze this bank statement and extract transactions and insights:\n\n${bankStatementText}`
          }
        ],
        max_tokens: 4000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error ${response.status}:`, errorText);
      
      // Handle rate limit (429) or other API errors gracefully
      if (response.status === 429) {
        // Update bank statement with rate limit error status
        await supabase
          .from('bank_statements')
          .update({
            processing_status: 'rate_limited',
            ai_analysis: { error: 'OpenAI API rate limit exceeded. Please try again later.' }
          })
          .eq('id', bankStatement.id);
          
        return new Response(JSON.stringify({ 
          success: false,
          error: 'OpenAI API rate limit exceeded. Please try again later.',
          bankStatementId: bankStatement.id,
          rate_limited: true
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices[0].message.content;
    
    console.log('AI analysis completed');

    let analysisData;
    try {
      // Try to parse the JSON response
      analysisData = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: store raw response
      analysisData = { raw_response: analysisText };
    }

    // Update bank statement with AI analysis
    await supabase
      .from('bank_statements')
      .update({
        processing_status: 'completed',
        ai_analysis: analysisData
      })
      .eq('id', bankStatement.id);

    // Insert transactions if parsed successfully
    if (analysisData.transactions && Array.isArray(analysisData.transactions)) {
      const transactionsToInsert = analysisData.transactions.map((transaction: any) => ({
        user_id: user.id,
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        transaction_type: transaction.transaction_type,
        category: transaction.category,
        merchant: transaction.merchant,
        ai_parsed: true
      }));

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionsToInsert);

      if (transactionError) {
        console.error('Error inserting transactions:', transactionError);
      } else {
        console.log(`Inserted ${transactionsToInsert.length} transactions`);
      }
    }

    // Insert spending insights if parsed successfully
    if (analysisData.insights && Array.isArray(analysisData.insights)) {
      const insightsToInsert = analysisData.insights.map((insight: any) => ({
        user_id: user.id,
        insight_type: insight.type,
        title: insight.title,
        description: insight.description,
        potential_savings: insight.potential_savings,
        priority: insight.priority,
        status: 'new'
      }));

      const { error: insightError } = await supabase
        .from('spending_insights')
        .insert(insightsToInsert);

      if (insightError) {
        console.error('Error inserting insights:', insightError);
      } else {
        console.log(`Inserted ${insightsToInsert.length} insights`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisData,
      bankStatementId: bankStatement.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in analyze-bank-statement function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});