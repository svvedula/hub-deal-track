import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dashboardImage from "@/assets/dashboard-preview.jpg";
import { ArrowUpRight, DollarSign, Users, TrendingUp, Package } from "lucide-react";

const mockStats = [
  {
    icon: DollarSign,
    label: "Monthly Revenue",
    value: "$24,567",
    change: "+12.5%",
    positive: true
  },
  {
    icon: Users,
    label: "Active Deals",
    value: "143",
    change: "+8.2%",
    positive: true
  },
  {
    icon: TrendingUp,
    label: "Growth Rate",
    value: "18.4%",
    change: "+2.1%",
    positive: true
  },
  {
    icon: Package,
    label: "Inventory Value",
    value: "$89,234",
    change: "-2.3%",
    positive: false
  }
];

const DashboardPreview = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                📊 Real-Time Analytics
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Get Complete Visibility Into Your Business
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Track key metrics, monitor deal progress, and get actionable insights 
                that help you make better business decisions every day.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {mockStats.map((stat, index) => (
                <Card key={index} className="border-card-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-xs font-medium ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button variant="premium" size="lg" className="group">
              Explore Dashboard
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-2xl"></div>
            <img 
              src={dashboardImage} 
              alt="Business analytics dashboard" 
              className="relative z-10 rounded-2xl shadow-lg-custom w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;