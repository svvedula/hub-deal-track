import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, Handshake, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const BusinessDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    setBusinesses(data || []);
  };

  // Only show real businesses from database
  const staticBusinesses: any[] = [];

  const categories = ["All", "Food & Beverage", "Technology", "Services", "Equipment", "Design"];

  const allBusinesses = [...businesses, ...staticBusinesses];
  
  const filteredBusinesses = allBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "All" || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Business Directory</h1>
                <p className="text-xs text-muted-foreground">Discover and connect with local businesses</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredBusinesses.length} businesses
          </p>
        </div>

        {filteredBusinesses.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No businesses found</h3>
                  <p className="text-muted-foreground">
                    There are no businesses in the directory yet. Try creating one from your dashboard!
                  </p>
                </div>
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  Go back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
            <Card key={business.id} className="border-card-border hover:shadow-lg-custom transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{business.image}</div>
                    <div>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {business.location}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{business.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  {business.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{business.connections} connections</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Handshake className="h-4 w-4 text-success" />
                      <span>{business.activeDeals} deals</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1">
                    Connect
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDirectory;