import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Handshake, 
  Package, 
  MapPin, 
  TrendingUp,
  Plus,
  Bell
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "Active Deals", value: "12", change: "+3", icon: Handshake, color: "text-success" },
    { title: "Network Connections", value: "48", change: "+7", icon: Users, color: "text-primary" },
    { title: "Monthly Revenue", value: "$24,500", change: "+12%", icon: TrendingUp, color: "text-warning" },
    { title: "Inventory Items", value: "1,234", change: "-5", icon: Package, color: "text-primary" },
  ];

  const recentDeals = [
    { name: "Coffee Bean Supply", company: "Local Roasters Co.", status: "In Progress", value: "$2,400" },
    { name: "Marketing Partnership", company: "Digital Solutions", status: "Negotiating", value: "$1,200" },
    { name: "Equipment Lease", company: "Tech Rentals", status: "Pending", value: "$800" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bizzy Dashboard</h1>
              <p className="text-xs text-muted-foreground">Welcome back, Alex!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-card-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-success">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Deals */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Deals
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
              <CardDescription>
                Your latest business deals and partnerships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeals.map((deal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-card-border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{deal.name}</p>
                      <p className="text-sm text-muted-foreground">{deal.company}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="secondary">{deal.status}</Badge>
                      <p className="text-sm font-medium">{deal.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Find Businesses</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Handshake className="h-6 w-6" />
                  <span>Create Deal</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Package className="h-6 w-6" />
                  <span>Manage Inventory</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;