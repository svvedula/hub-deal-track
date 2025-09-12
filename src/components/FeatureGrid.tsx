import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Handshake, 
  Package, 
  MapPin, 
  TrendingUp 
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Business Networking",
    description: "Connect with other small businesses in your industry and locality.",
    color: "text-primary",
    badge: "Network"
  },
  {
    icon: Handshake,
    title: "Deal Management",
    description: "Track negotiations, partnerships, and business deals all in one place.",
    color: "text-success",
    badge: "Deals"
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Get insights into your business performance with detailed analytics.",
    color: "text-warning",
    badge: "Analytics"
  },
  {
    icon: Package,
    title: "Inventory Tracking",
    description: "Monitor inventory levels, track products, and manage stock efficiently.",
    color: "text-primary",
    badge: "Inventory"
  },
  {
    icon: MapPin,
    title: "Multi-Location Management",
    description: "Manage multiple store locations and track performance across sites.",
    color: "text-success",
    badge: "Locations"
  },
  {
    icon: TrendingUp,
    title: "Growth Insights",
    description: "Identify opportunities for growth and optimize your business strategy.",
    color: "text-warning",
    badge: "Growth"
  }
];

const FeatureGrid = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything Your Business Needs
          </h2>
          <p className="text-xl text-muted-foreground">
            From networking to analytics, manage every aspect of your business growth with our comprehensive platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-card-border hover:shadow-lg-custom transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-success/10 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;