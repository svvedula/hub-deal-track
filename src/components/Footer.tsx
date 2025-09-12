import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-card-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-foreground">Bizzy</span>
            </div>
            <p className="text-muted-foreground">
              Empowering small businesses to connect, track, and grow together.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#dashboard" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#network" className="hover:text-primary transition-colors">Business Network</a></li>
              <li><a href="#deals" className="hover:text-primary transition-colors">Deal Management</a></li>
              <li><a href="#analytics" className="hover:text-primary transition-colors">Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#support" className="hover:text-primary transition-colors">Support</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Get Started</h3>
            <p className="text-muted-foreground mb-4">
              Ready to grow your business?
            </p>
            <Button variant="hero" className="w-full">
              Start Free Trial
            </Button>
          </div>
        </div>
        
        <div className="border-t border-card-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Bizzy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;