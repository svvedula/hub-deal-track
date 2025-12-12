import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import FinancialDashboard from "@/components/financial/FinancialDashboard";
import DealsMarketplace from "@/components/marketplace/DealsMarketplace";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import DeliveryCompany from "@/components/delivery/DeliveryCompany";
import BusinessAnalytics from "@/components/analytics/BusinessAnalytics";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Search,
  Plus,
  BarChart3,
  Archive,
  LogOut,
  CreditCard,
  Handshake,
  ArrowLeft,
  Truck,
  Building2,
  UserCog
} from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const [profile, setProfile] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchDeals();
      fetchBusinesses();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();
    setProfile(data);
  };

  const fetchDeals = async () => {
    const { data } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);
    setDeals(data || []);
  };

  const fetchBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user?.id);
    setBusinesses(data || []);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const totalRevenue = deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setActiveTab("overview");
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "find-businesses":
        navigate('/directory');
        break;
      case "create-deal":
        setActiveTab("marketplace");
        break;
      case "view-analytics":
        setCurrentView("analytics");
        break;
      case "manage-inventory":
        setCurrentView("inventory");
        break;
      case "delivery-companies":
        setCurrentView("delivery");
        break;
      default:
        break;
    }
  };

  if (currentView === "analytics") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <BusinessAnalytics />
        </div>
      </div>
    );
  }

  if (currentView === "inventory") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <InventoryManagement />
        </div>
      </div>
    );
  }

  if (currentView === "delivery") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <DeliveryCompany />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Business Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.business_name || 'Business Owner'}! Manage your finances and discover deals.</p>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Button onClick={() => navigate("/admin")} variant="secondary">
                Admin Panel
              </Button>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Financial AI
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Deal Marketplace
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{deals.length}</div>
                  <p className="text-xs text-muted-foreground">Total deals created</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Businesses</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businesses.length}</div>
                  <p className="text-xs text-muted-foreground">Registered businesses</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">From all deals</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Business Email</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold truncate">{profile?.email}</div>
                  <p className="text-xs text-muted-foreground">Account email</p>
                </CardContent>
              </Card>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Deals */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deals</CardTitle>
                  <CardDescription>Your latest business deals and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deals.length > 0 ? deals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{deal.company_name}</p>
                          <Badge variant={deal.status === "completed" ? "default" : deal.status === "in_progress" ? "secondary" : "outline"}>
                            {deal.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">${Number(deal.value).toLocaleString()}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-center py-4">No deals yet. Create your first deal to get started!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to grow your business network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => handleQuickAction("find-businesses")}
                    >
                      <Search className="h-6 w-6" />
                      Find Businesses
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => handleQuickAction("create-deal")}
                    >
                      <Plus className="h-6 w-6" />
                      Create Deal
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => handleQuickAction("view-analytics")}
                    >
                      <BarChart3 className="h-6 w-6" />
                      View Analytics
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => handleQuickAction("manage-inventory")}
                    >
                      <Archive className="h-6 w-6" />
                      Manage Inventory
                    </Button>
                  </div>
                  
                  {/* Additional Actions Row */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex items-center justify-center gap-2"
                      onClick={() => handleQuickAction("delivery-companies")}
                    >
                      <Truck className="h-6 w-6" />
                      Delivery Companies
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex items-center justify-center gap-2"
                      onClick={() => navigate('/profile-settings')}
                    >
                      <UserCog className="h-6 w-6" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex items-center justify-center gap-2"
                      onClick={() => navigate('/companies')}
                    >
                      <Building2 className="h-6 w-6" />
                      Company Directory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <FinancialDashboard />
          </TabsContent>

          <TabsContent value="marketplace">
            <DealsMarketplace />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryCompany />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}