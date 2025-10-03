import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  business_name: string;
  email: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  profile: Profile | null;
}

export const AdminRoles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("business_name");

      if (profilesError) throw profilesError;

      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .order("role");

      if (rolesError) throw rolesError;

      // Map profiles by user_id
      const profilesMap: Record<string, Profile> = {};
      profilesData?.forEach((p) => {
        profilesMap[p.user_id] = p;
      });

      // Enrich roles with profile data
      const enrichedRoles = rolesData.map((role) => ({
        ...role,
        profile: profilesMap[role.user_id] || null,
      }));

      setProfiles(profilesData || []);
      setUserRoles(enrichedRoles);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Please select a user and role");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ 
          user_id: selectedUser, 
          role: selectedRole as "owner" | "moderator" | "user"
        }]);

      if (error) throw error;

      toast.success("Role assigned successfully");
      setSelectedUser("");
      setSelectedRole("");
      fetchData();
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("Failed to assign role");
    }
  };

  const removeRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;

      toast.success("Role removed successfully");
      fetchData();
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error("Failed to remove role");
    }
  };

  if (loading) return <div>Loading roles...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 p-4 border rounded-lg">
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.user_id} value={profile.user_id}>
                {profile.business_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={assignRole}>
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Role
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRoles.map((userRole) => (
              <TableRow key={userRole.id}>
                <TableCell className="font-medium">
                  {userRole.profile?.business_name || "Unknown"}
                </TableCell>
                <TableCell>{userRole.profile?.email || "N/A"}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-primary/10 capitalize">
                    {userRole.role}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeRole(userRole.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
