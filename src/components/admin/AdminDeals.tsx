import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Deal {
  id: string;
  company_name: string;
  value: number;
  status: string;
  created_at: string;
  user_profile: { business_name: string } | null;
}

export const AdminDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      // Get deals first
      const { data: dealsData, error: dealsError } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (dealsError) throw dealsError;

      // Get profiles for all user IDs
      const uniqueUserIds = Array.from(new Set(dealsData.map((d) => d.user_id)));
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, business_name")
        .in("user_id", uniqueUserIds);

      if (profilesError) throw profilesError;

      // Map profiles
      const profilesMap: Record<string, { business_name: string }> = {};
      profilesData?.forEach((p) => {
        profilesMap[p.user_id] = { business_name: p.business_name };
      });

      // Combine data
      const enrichedDeals = dealsData.map((deal) => ({
        ...deal,
        user_profile: profilesMap[deal.user_id] || null,
      }));

      setDeals(enrichedDeals);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyPenalty = async () => {
    if (!selectedDeal || !penaltyAmount) return;

    try {
      const penalty = parseFloat(penaltyAmount);
      const newValue = selectedDeal.value - penalty;

      const { error } = await supabase
        .from("deals")
        .update({ value: newValue })
        .eq("id", selectedDeal.id);

      if (error) throw error;

      toast.success(`Penalty of $${penalty} applied to deal`);
      setPenaltyAmount("");
      setSelectedDeal(null);
      fetchDeals();
    } catch (error) {
      console.error("Error applying penalty:", error);
      toast.error("Failed to apply penalty");
    }
  };

  if (loading) return <div>Loading deals...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell className="font-medium">{deal.company_name}</TableCell>
              <TableCell>{deal.user_profile?.business_name || "Unknown"}</TableCell>
              <TableCell>${deal.value.toLocaleString()}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs bg-primary/10">
                  {deal.status}
                </span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDeal(deal)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Penalty
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply Penalty</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Deal: {deal.company_name}</Label>
                        <p className="text-sm text-muted-foreground">
                          Current Value: ${deal.value.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="penalty">Penalty Amount ($)</Label>
                        <Input
                          id="penalty"
                          type="number"
                          value={penaltyAmount}
                          onChange={(e) => setPenaltyAmount(e.target.value)}
                          placeholder="Enter penalty amount"
                        />
                      </div>
                      <Button onClick={applyPenalty} className="w-full">
                        Apply Penalty
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
