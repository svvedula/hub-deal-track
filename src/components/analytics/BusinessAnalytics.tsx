import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Building2, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  date: string;
  category: string | null;
}

interface RecommendedBusiness {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string | null;
  description: string | null;
  location: string | null;
}

export default function BusinessAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [previousMonthProfit, setPreviousMonthProfit] = useState(0);
  const [recommendedBusinesses, setRecommendedBusinesses] = useState<RecommendedBusiness[]>([]);
  const [userProfile, setUserProfile] = useState<{ business_type: string | null } | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Get user's profile to understand their business type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('business_type')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      setUserProfile(profileData);

      // Calculate date ranges
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch this month's transactions
      const { data: thisMonthTransactions } = await supabase
        .from('transactions')
        .select('amount, transaction_type, date, category')
        .eq('user_id', user?.id)
        .gte('date', firstDayThisMonth.toISOString().split('T')[0]);

      // Fetch last month's transactions
      const { data: lastMonthTransactions } = await supabase
        .from('transactions')
        .select('amount, transaction_type')
        .eq('user_id', user?.id)
        .gte('date', firstDayLastMonth.toISOString().split('T')[0])
        .lte('date', lastDayLastMonth.toISOString().split('T')[0]);

      // Calculate this month's profit/loss
      let income = 0;
      let expenses = 0;
      (thisMonthTransactions || []).forEach((t: Transaction) => {
        if (t.transaction_type === 'income') {
          income += Number(t.amount);
        } else {
          expenses += Number(t.amount);
        }
      });
      
      setMonthlyIncome(income);
      setMonthlyExpenses(expenses);
      setMonthlyProfit(income - expenses);

      // Calculate last month's profit
      let lastIncome = 0;
      let lastExpenses = 0;
      (lastMonthTransactions || []).forEach((t: Pick<Transaction, 'amount' | 'transaction_type'>) => {
        if (t.transaction_type === 'income') {
          lastIncome += Number(t.amount);
        } else {
          lastExpenses += Number(t.amount);
        }
      });
      setPreviousMonthProfit(lastIncome - lastExpenses);

      // Fetch recommended businesses (other users' profiles)
      // Get businesses that complement the user's business type
      const { data: businesses } = await supabase
        .from('profiles')
        .select('id, user_id, business_name, business_type, description, location')
        .neq('user_id', user?.id)
        .limit(6);

      setRecommendedBusinesses(businesses || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageBusiness = (businessUserId: string) => {
    navigate(`/chat?recipient=${businessUserId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const profitChange = previousMonthProfit !== 0 
    ? ((monthlyProfit - previousMonthProfit) / Math.abs(previousMonthProfit)) * 100 
    : monthlyProfit > 0 ? 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Business Analytics</h2>
        <p className="text-muted-foreground">Your monthly performance and growth opportunities</p>
      </div>

      {/* Profit/Loss Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(monthlyIncome)}</div>
            <p className="text-xs text-muted-foreground">This month's earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">This month's spending</p>
          </CardContent>
        </Card>

        <Card className={monthlyProfit >= 0 ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
            <DollarSign className={`h-4 w-4 ${monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              {monthlyProfit >= 0 ? '+' : ''}{formatCurrency(monthlyProfit)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {profitChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-success" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-destructive" />
              )}
              <p className={`text-xs ${profitChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {Math.abs(profitChange).toFixed(1)}% vs last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Recommended Partners
          </CardTitle>
          <CardDescription>
            Companies you can cooperate with to help grow your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendedBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedBusinesses.map((business) => (
                <Card key={business.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">
                            {business.business_name}
                          </h4>
                          {business.business_type && (
                            <Badge variant="secondary" className="mt-1">
                              {business.business_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {business.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {business.description}
                        </p>
                      )}
                      
                      {business.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          📍 {business.location}
                        </p>
                      )}
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleMessageBusiness(business.user_id)}
                        className="w-full mt-2"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No recommended businesses available yet. 
                <br />
                Complete your profile to get personalized recommendations.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/profile-settings')}
              >
                Complete Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
