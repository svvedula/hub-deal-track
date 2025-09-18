import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Package, Clock, CheckCircle, Mail } from "lucide-react";

const DeliveryCompany = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const deliveryCompanies = [
    {
      id: "sv-delivery",
      name: "SV DELIVERY",
      description: "Fast and reliable business delivery service",
      rating: 4.8,
      estimatedTime: "2-4 hours",
      price: "$25.00",
      features: ["Same-day delivery", "Business priority", "Email notifications", "Package tracking"]
    },
    {
      id: "express-logistics",
      name: "Express Logistics",
      description: "Premium express delivery solutions",
      rating: 4.6,
      estimatedTime: "1-2 hours",
      price: "$35.00",
      features: ["Express delivery", "Real-time tracking", "Insurance included"]
    },
    {
      id: "reliable-transport",
      name: "Reliable Transport Co.",
      description: "Cost-effective delivery for businesses",
      rating: 4.4,
      estimatedTime: "4-8 hours",
      price: "$18.00",
      features: ["Budget-friendly", "Bulk discounts", "Scheduled delivery"]
    }
  ];

  const handleSelectDelivery = async (companyId: string) => {
    if (companyId === "sv-delivery") {
      setIsBooking(true);
      
      try {
        // Send email notification for SV DELIVERY
        const { error } = await supabase.functions.invoke('send-delivery-notification', {
          body: {
            userEmail: user?.email,
            companyName: "SV DELIVERY",
            deliveryDetails: {
              estimatedTime: "2-4 hours",
              price: "$25.00",
              features: ["Same-day delivery", "Business priority", "Email notifications", "Package tracking"]
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Delivery Booked Successfully!",
          description: "SV DELIVERY has been selected. A confirmation email has been sent to your registered email address.",
        });
      } catch (error) {
        console.error('Error sending delivery notification:', error);
        toast({
          title: "Delivery Booked",
          description: "SV DELIVERY has been selected. Note: Email notification service is currently unavailable.",
          variant: "default"
        });
      } finally {
        setIsBooking(false);
      }
    } else {
      setSelectedCompany(companyId);
      toast({
        title: "Delivery Selected",
        description: `${deliveryCompanies.find(c => c.id === companyId)?.name} has been selected for your delivery.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Delivery Companies</h2>
          <p className="text-muted-foreground">Choose a delivery partner for your business needs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryCompanies.map((company) => (
          <Card 
            key={company.id} 
            className={`border-card-border hover:shadow-lg-custom transition-all duration-300 ${
              selectedCompany === company.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">⭐ {company.rating}</Badge>
                      {company.id === "sv-delivery" && (
                        <Badge variant="default">Recommended</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                {company.description}
              </CardDescription>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{company.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-success" />
                  <span className="font-semibold">{company.price}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {company.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {company.id === "sv-delivery" && (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-primary font-medium">Email notification included</span>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => handleSelectDelivery(company.id)}
                className="w-full"
                disabled={isBooking}
                variant={company.id === "sv-delivery" ? "default" : "outline"}
              >
                {isBooking && company.id === "sv-delivery" ? (
                  "Booking..."
                ) : selectedCompany === company.id ? (
                  "Selected"
                ) : (
                  "Select Delivery"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCompany && (
        <Card className="bg-success/10 border-success/20">
          <CardHeader>
            <CardTitle className="text-success">Delivery Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-success">
              Your delivery has been scheduled with {deliveryCompanies.find(c => c.id === selectedCompany)?.name}. 
              {selectedCompany === "sv-delivery" && " A confirmation email has been sent to your registered address."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryCompany;