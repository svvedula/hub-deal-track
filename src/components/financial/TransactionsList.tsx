import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  transaction_type: 'income' | 'expense';
  category: string;
  merchant: string;
  ai_parsed: boolean;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export default function TransactionsList({ transactions }: TransactionsListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      food: 'bg-orange-100 text-orange-800',
      transportation: 'bg-blue-100 text-blue-800',
      utilities: 'bg-purple-100 text-purple-800',
      entertainment: 'bg-pink-100 text-pink-800',
      shopping: 'bg-green-100 text-green-800',
      healthcare: 'bg-red-100 text-red-800',
      business: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          Your latest financial activity from uploaded statements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs">Upload a bank statement to see your transactions</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.transaction_type === 'income' 
                      ? 'bg-success/10' 
                      : 'bg-destructive/10'
                  }`}>
                    {transaction.transaction_type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {transaction.description}
                      </p>
                      {transaction.ai_parsed && (
                        <Badge variant="secondary" className="text-xs">
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(transaction.date)}</span>
                      
                      {transaction.merchant && (
                        <>
                          <Building className="h-3 w-3" />
                          <span className="truncate max-w-[100px]">{transaction.merchant}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-bold ${
                    transaction.transaction_type === 'income' 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                  
                  {transaction.category && (
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
                        {transaction.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}