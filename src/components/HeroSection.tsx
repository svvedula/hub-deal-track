import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-business.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/login');
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                🚀 Platform for Small Businesses
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Connect, Track, and 
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Grow</span> Your Business
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The all-in-one platform where small businesses network, make deals, 
                track performance, and manage operations across multiple locations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="shadow-hero" onClick={handleStartTrial}>
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>No credit card required</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 rounded-3xl blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Business professionals collaborating" 
              className="relative z-10 rounded-3xl shadow-hero w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;