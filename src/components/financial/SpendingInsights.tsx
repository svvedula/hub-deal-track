import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Lightbulb, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Eye,
  X
} from "lucide-react";

interface SpendingInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  potential_savings: number;
  priority: string;
  status: string;
  created_at: string;
}

interface SpendingInsightsProps {
  onRefresh: () => void;
}

export default function SpendingInsights({ onRefresh }: SpendingInsightsProps) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('spending_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching insights:', error);
        return;
      }

      setInsights(data || []);
    } catch (error) {
      console.error('Error in fetchInsights:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInsightStatus = async (insightId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('spending_insights')
        .update({ status: newStatus })
        .eq('id', insightId);

      if (error) {
        console.error('Error updating insight status:', error);
        return;
      }

      // Update local state
      setInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, status: newStatus }
            : insight
        )
      );
    } catch (error) {
      console.error('Error in updateInsightStatus:', error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cost_cutting':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'revenue_opportunity':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'cash_flow':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Lightbulb className="h-4 w-4 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Spending Insights
        </CardTitle>
        <CardDescription>
          Personalized recommendations to optimize your finances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No insights yet</p>
              <p className="text-xs">Upload a bank statement to get AI-powered insights</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border transition-all ${
                  insight.status === 'new' ? 'bg-accent/50 border-primary/20' : 'bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.insight_type)}
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                      {insight.priority}
                    </Badge>
                    {insight.status === 'new' && (
                      <Badge variant="default" className="text-xs">New</Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                
                {insight.potential_savings && insight.potential_savings > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-success">
                      Potential savings: {formatCurrency(insight.potential_savings)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {insight.status === 'new' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateInsightStatus(insight.id, 'viewed')}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Mark as Read
                    </Button>
                  )}
                  
                  {insight.status === 'viewed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateInsightStatus(insight.id, 'acted_on')}
                      className="text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark as Done
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateInsightStatus(insight.id, 'dismissed')}
                    className="text-xs text-muted-foreground"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}