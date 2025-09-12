import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="border-b border-card-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Bizzy</h1>
            <p className="text-xs text-muted-foreground">Business Growth Platform</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
          <a href="/directory" className="text-foreground hover:text-primary transition-colors">Directory</a>
          <a href="#deals" className="text-foreground hover:text-primary transition-colors">Deals</a>
          <a href="#analytics" className="text-foreground hover:text-primary transition-colors">Analytics</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Pro Plan
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <a href="/login">Sign In</a>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <a href="/signup">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;