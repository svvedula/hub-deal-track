import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CreateDealForm from "./CreateDealForm";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Users, 
  Building,
  MapPin,
  Eye,
  Calendar
} from "lucide-react";

interface DealOpportunity {
  id: string;
  creator_user_id: string;
  title: string;
  description: string;
  deal_type: string;
  industry: string;
  investment_range_min: number;
  investment_range_max: number;
  location: string;
  status: string;
  views_count: number;
  interested_parties: number;
  created_at: string;
}

export default function DealsMarketplace() {
  const { user } = useAuth();
  const [deals, setDeals] = useState<DealOpportunity[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, searchTerm, filterType, filterIndustry]);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deal_opportunities')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deals:', error);
        return;
      }

      setDeals(data || []);
    } catch (error) {
      console.error('Error in fetchDeals:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = deals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(deal => deal.deal_type === filterType);
    }

    // Industry filter
    if (filterIndustry !== "all") {
      filtered = filtered.filter(deal => deal.industry === filterIndustry);
    }

    setFilteredDeals(filtered);
  };

  const handleDealClick = async (dealId: string) => {
    // Increment view count
    try {
      await supabase.rpc('increment_deal_views', { deal_id: dealId });
      
      // Update local state
      setDeals(prev => 
        prev.map(deal => 
          deal.id === dealId 
            ? { ...deal, views_count: deal.views_count + 1 }
            : deal
        )
      );
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getDealTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      seeking_investment: 'bg-blue-100 text-blue-800',
      offering_investment: 'bg-green-100 text-green-800',
      partnership: 'bg-purple-100 text-purple-800',
      acquisition: 'bg-red-100 text-red-800',
      joint_venture: 'bg-orange-100 text-orange-800',
      supplier: 'bg-yellow-100 text-yellow-800',
      customer: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDealTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Business Deals Marketplace</h2>
          <p className="text-muted-foreground">
            Discover investment opportunities and business partnerships
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post a New Deal Opportunity</DialogTitle>
              <DialogDescription>
                Share your business opportunity with potential partners and investors
              </DialogDescription>
            </DialogHeader>
            <CreateDealForm 
              onSuccess={() => {
                setShowCreateModal(false);
                fetchDeals();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals, industries, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Deal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="seeking_investment">Seeking Investment</SelectItem>
                <SelectItem value="offering_investment">Offering Investment</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="acquisition">Acquisition</SelectItem>
                <SelectItem value="joint_venture">Joint Venture</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterIndustry} onValueChange={setFilterIndustry}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No deals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or be the first to post a deal!
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post First Deal
            </Button>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <Card 
              key={deal.id} 
              className="cursor-pointer hover:shadow-lg-custom transition-all duration-200"
              onClick={() => handleDealClick(deal.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={getDealTypeColor(deal.deal_type)}>
                    {getDealTypeLabel(deal.deal_type)}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {deal.views_count}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{deal.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {deal.description}
                </p>
                
                {deal.investment_range_min && deal.investment_range_max && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-medium">
                      {formatCurrency(deal.investment_range_min)} - {formatCurrency(deal.investment_range_max)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span className="capitalize">{deal.industry}</span>
                  </div>
                  
                  {deal.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{deal.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(deal.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{deal.interested_parties} interested</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}