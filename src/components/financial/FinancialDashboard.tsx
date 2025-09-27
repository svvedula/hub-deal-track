import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BankStatementUpload from "./BankStatementUpload";
import SpendingInsights from "./SpendingInsights";
import TransactionsList from "./TransactionsList";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  transactionCount: number;
  topCategories: { category: string; amount: number; count: number }[];
}

export default function FinancialDashboard() {
  const { user } = useAuth();
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0,
    transactionCount: 0,
    topCategories: []
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user, refreshKey]);

  const fetchFinancialData = async () => {
    if (!user) return;

    try {
      // Fetch all transactions (we'll show recent period in summary)
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      // Calculate summary
      const income = transactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = transactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Group by category
      const categoryMap = new Map();
      transactions
        .filter(t => t.transaction_type === 'expense')
        .forEach(t => {
          const category = t.category || 'other';
          const existing = categoryMap.get(category) || { amount: 0, count: 0 };
          categoryMap.set(category, {
            amount: existing.amount + Number(t.amount),
            count: existing.count + 1
          });
        });

      const topCategories = Array.from(categoryMap.entries())
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      setFinancialSummary({
        totalIncome: income,
        totalExpenses: expenses,
        netCashFlow: income - expenses,
        transactionCount: transactions.length,
        topCategories
      });

      setRecentTransactions(transactions.slice(0, 10));

    } catch (error) {
      console.error('Error in fetchFinancialData:', error);
    }
  };

  const handleAnalysisComplete = () => {
    // Refresh data after new analysis
    setRefreshKey(prev => prev + 1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Financial Dashboard</h2>
        <p className="text-muted-foreground">
          AI-powered insights into your business finances and spending patterns
        </p>
      </div>

      {/* Upload Component */}
      <BankStatementUpload onAnalysisComplete={handleAnalysisComplete} />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(financialSummary.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(financialSummary.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            {financialSummary.netCashFlow >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              financialSummary.netCashFlow >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {formatCurrency(financialSummary.netCashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.transactionCount}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Spending Categories */}
      {financialSummary.topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Spending Categories
            </CardTitle>
            <CardDescription>Your biggest expense categories this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {financialSummary.topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-primary`} style={{
                      opacity: 1 - (index * 0.15)
                    }} />
                    <span className="capitalize font-medium">{category.category}</span>
                    <Badge variant="secondary">{category.count} transactions</Badge>
                  </div>
                  <span className="font-bold text-destructive">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Insights and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingInsights onRefresh={handleAnalysisComplete} />
        <TransactionsList transactions={recentTransactions} />
      </div>
    </div>
  );
}