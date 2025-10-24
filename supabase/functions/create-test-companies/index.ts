import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestCompany {
  email: string;
  password: string;
  business_name: string;
  business_type: string;
  description: string;
  location: string;
  phone: string;
  website: string;
}

const testCompanies: TestCompany[] = [
  {
    email: 'techflow@example.com',
    password: 'TestPass123!',
    business_name: 'TechFlow Solutions',
    business_type: 'Technology',
    description: 'Leading provider of cloud-based business solutions and enterprise software. Specializing in digital transformation and automation.',
    location: 'San Francisco, CA',
    phone: '+1 (415) 555-0101',
    website: 'https://techflow.example.com'
  },
  {
    email: 'greenvalley@example.com',
    password: 'TestPass123!',
    business_name: 'Green Valley Farms',
    business_type: 'Agriculture',
    description: 'Organic farming cooperative focused on sustainable agriculture and farm-to-table produce distribution.',
    location: 'Portland, OR',
    phone: '+1 (503) 555-0202',
    website: 'https://greenvalley.example.com'
  },
  {
    email: 'metrologistics@example.com',
    password: 'TestPass123!',
    business_name: 'Metro Logistics Inc',
    business_type: 'Logistics',
    description: 'Full-service logistics and supply chain management company with nationwide distribution network.',
    location: 'Chicago, IL',
    phone: '+1 (312) 555-0303',
    website: 'https://metrologistics.example.com'
  },
  {
    email: 'oceanconsulting@example.com',
    password: 'TestPass123!',
    business_name: 'Ocean Business Consulting',
    business_type: 'Consulting',
    description: 'Strategic business consulting firm helping companies scale and optimize operations.',
    location: 'Miami, FL',
    phone: '+1 (305) 555-0404',
    website: 'https://oceanconsulting.example.com'
  },
  {
    email: 'peakfinancial@example.com',
    password: 'TestPass123!',
    business_name: 'Peak Financial Services',
    business_type: 'Finance',
    description: 'Boutique financial advisory firm specializing in investment management and corporate finance.',
    location: 'New York, NY',
    phone: '+1 (212) 555-0505',
    website: 'https://peakfinancial.example.com'
  },
  {
    email: 'bluemanufacturing@example.com',
    password: 'TestPass123!',
    business_name: 'Blue Sky Manufacturing',
    business_type: 'Manufacturing',
    description: 'Advanced manufacturing facility producing precision components for aerospace and automotive industries.',
    location: 'Detroit, MI',
    phone: '+1 (313) 555-0606',
    website: 'https://bluemanufacturing.example.com'
  }
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const results = []

    for (const company of testCompanies) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existingUsers?.users?.some(u => u.email === company.email)

      let userId: string

      if (userExists) {
        const existingUser = existingUsers?.users?.find(u => u.email === company.email)
        userId = existingUser!.id
        results.push({ email: company.email, status: 'already_exists', userId })
      } else {
        // Create the user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: company.email,
          password: company.password,
          email_confirm: true,
          user_metadata: {
            business_name: company.business_name
          }
        })

        if (authError) {
          results.push({ email: company.email, status: 'error', error: authError.message })
          continue
        }

        userId = authData.user.id

        // Update the profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            business_name: company.business_name,
            business_type: company.business_type,
            description: company.description,
            location: company.location,
            phone: company.phone,
            website: company.website
          })
          .eq('user_id', userId)

        if (profileError) {
          results.push({ email: company.email, status: 'profile_error', error: profileError.message })
          continue
        }

        results.push({ email: company.email, status: 'created', userId })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
