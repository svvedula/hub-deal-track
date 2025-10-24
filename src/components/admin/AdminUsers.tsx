import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Ban, Trash2, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  email: string;
  created_at: string;
  banned_until?: string;
  profile?: {
    business_name: string;
    business_type: string | null;
  };
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all profiles with user data
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, business_name, business_type, email")
        .order("business_name");

      if (profilesError) throw profilesError;

      // Get auth users data via edge function
      const { data: authData, error: authError } = await supabase.functions.invoke('get-users-admin');
      
      if (authError) throw authError;

      // Combine the data
      const usersWithProfiles = authData.users.map((authUser: any) => {
        const profile = profiles?.find(p => p.user_id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          banned_until: authUser.banned_until,
          profile: profile ? {
            business_name: profile.business_name,
            business_type: profile.business_type,
          } : undefined,
        };
      });

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase.functions.invoke('manage-user-admin', {
        body: { action: 'ban', userId }
      });

      if (error) throw error;

      toast.success("User banned successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Failed to ban user");
    } finally {
      setActionLoading(null);
    }
  };

  const unbanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase.functions.invoke('manage-user-admin', {
        body: { action: 'unban', userId }
      });

      if (error) throw error;

      toast.success("User unbanned successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Failed to unban user");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase.functions.invoke('manage-user-admin', {
        body: { action: 'delete', userId }
      });

      if (error) throw error;

      toast.success("User deleted successfully");
      fetchUsers();
      setDeleteDialog({ open: false, userId: null });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.profile?.business_name.toLowerCase().includes(search.toLowerCase())
  );

  const isBanned = (user: User) => {
    if (!user.banned_until) return false;
    return new Date(user.banned_until) > new Date();
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.profile?.business_name || "No Profile"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.profile?.business_type || "N/A"}</TableCell>
                <TableCell>
                  {isBanned(user) ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/profile/${user.id}`)}
                      disabled={actionLoading === user.id}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/chat/${user.id}`)}
                      disabled={actionLoading === user.id}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    {isBanned(user) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unbanUser(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Unban
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => banUser(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Ban
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteDialog({ open: true, userId: user.id })}
                      disabled={actionLoading === user.id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, userId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and all associated data including their profile, messages, and deals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.userId && deleteUser(deleteDialog.userId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};