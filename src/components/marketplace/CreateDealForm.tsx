import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface CreateDealFormProps {
  onSuccess: () => void;
}

export default function CreateDealForm({ onSuccess }: CreateDealFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deal_type: "",
    industry: "",
    investment_range_min: "",
    investment_range_max: "",
    location: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.title || !formData.description || !formData.deal_type) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, description, and deal type.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const dealData = {
        creator_user_id: user.id,
        title: formData.title,
        description: formData.description,
        deal_type: formData.deal_type,
        industry: formData.industry || null,
        investment_range_min: formData.investment_range_min ? parseFloat(formData.investment_range_min) : null,
        investment_range_max: formData.investment_range_max ? parseFloat(formData.investment_range_max) : null,
        location: formData.location || null,
        status: 'active'
      };

      const { error } = await supabase
        .from('deal_opportunities')
        .insert([dealData]);

      if (error) {
        console.error('Error creating deal:', error);
        throw new Error(error.message);
      }

      toast({
        title: "Deal posted successfully!",
        description: "Your deal is now live in the marketplace.",
      });

      onSuccess();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        deal_type: "",
        industry: "",
        investment_range_min: "",
        investment_range_max: "",
        location: ""
      });

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Failed to post deal",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title *</Label>
        <Input
          id="title"
          placeholder="Enter a compelling title for your deal"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deal_type">Deal Type *</Label>
        <Select value={formData.deal_type} onValueChange={(value) => handleInputChange('deal_type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select deal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seeking_investment">Seeking Investment</SelectItem>
            <SelectItem value="offering_investment">Offering Investment</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="acquisition">Acquisition</SelectItem>
            <SelectItem value="joint_venture">Joint Venture</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your deal opportunity in detail..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
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

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State/Country"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="investment_min">Min Investment ($)</Label>
          <Input
            id="investment_min"
            type="number"
            placeholder="0"
            value={formData.investment_range_min}
            onChange={(e) => handleInputChange('investment_range_min', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment_max">Max Investment ($)</Label>
          <Input
            id="investment_max"
            type="number"
            placeholder="0"
            value={formData.investment_range_max}
            onChange={(e) => handleInputChange('investment_range_max', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Post Deal
        </Button>
      </div>
    </form>
  );
}