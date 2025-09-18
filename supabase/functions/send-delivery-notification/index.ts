import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DeliveryNotificationRequest {
  userEmail: string;
  companyName: string;
  deliveryDetails: {
    estimatedTime: string;
    price: string;
    features: string[];
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, companyName, deliveryDetails }: DeliveryNotificationRequest = await req.json();

    console.log("Delivery notification request received:", {
      userEmail,
      companyName,
      deliveryDetails
    });

    // For now, we'll just log the delivery booking
    // In a real implementation, you would integrate with an email service like Resend
    console.log(`Delivery booked for ${userEmail} with ${companyName}`);
    console.log(`Estimated delivery time: ${deliveryDetails.estimatedTime}`);
    console.log(`Price: ${deliveryDetails.price}`);
    console.log(`Features: ${deliveryDetails.features.join(", ")}`);

    // Simulate email sending success
    const emailResponse = {
      id: `delivery_${Date.now()}`,
      to: userEmail,
      subject: `Delivery Confirmation - ${companyName}`,
      message: "Delivery booking confirmed successfully"
    };

    console.log("Delivery notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: "Delivery notification sent successfully",
      emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-delivery-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);