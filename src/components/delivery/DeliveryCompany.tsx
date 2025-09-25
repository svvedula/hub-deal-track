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
      id: "express-logistics",
      name: "Express Logistics",
      description: "Premium express delivery solutions",
      rating: 4.6,
      estimatedTime: "1-2 hours",
      price: "$35.00",
      email: "logistics@expressdelivery.com",
      features: ["Express delivery", "Real-time tracking", "Insurance included"]
    },
    {
      id: "reliable-transport",
      name: "Reliable Transport Co.",
      description: "Cost-effective delivery for businesses",
      rating: 4.4,
      estimatedTime: "4-8 hours",
      price: "$18.00",
      email: "orders@reliabletransport.com",
      features: ["Budget-friendly", "Bulk discounts", "Scheduled delivery"]
    }
  ];

  const handleSelectDelivery = async (companyId: string) => {
    const selectedCompanyData = deliveryCompanies.find(c => c.id === companyId);
    if (!selectedCompanyData) return;

    setIsBooking(true);
    
    try {
      // Send email notification to the delivery company
      const { error } = await supabase.functions.invoke('send-delivery-notification', {
        body: {
          companyEmail: selectedCompanyData.email,
          companyName: selectedCompanyData.name,
          userEmail: user?.email,
          deliveryDetails: {
            estimatedTime: selectedCompanyData.estimatedTime,
            price: selectedCompanyData.price,
            features: selectedCompanyData.features
          }
        }
      });

      if (error) throw error;

      setSelectedCompany(companyId);
      toast({
        title: "Delivery Booked Successfully!",
        description: `${selectedCompanyData.name} has been notified of your delivery request.`,
      });
    } catch (error) {
      console.error('Error sending delivery notification:', error);
      setSelectedCompany(companyId);
      toast({
        title: "Delivery Selected",
        description: `${selectedCompanyData.name} has been selected. Note: Email notification service is currently unavailable.`,
        variant: "default"
      });
    } finally {
      setIsBooking(false);
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

              
              <Button 
                onClick={() => handleSelectDelivery(company.id)}
                className="w-full"
                disabled={isBooking}
                variant="outline"
              >
                {isBooking ? (
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
              The delivery company has been notified of your request.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryCompany;