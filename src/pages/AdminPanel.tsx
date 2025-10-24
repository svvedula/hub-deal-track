import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, MessageSquare, DollarSign, ArrowLeft, Eye, Building2, UserCog } from "lucide-react";
import { AdminCompanies } from "@/components/admin/AdminCompanies";
import { AdminChats } from "@/components/admin/AdminChats";
import { AdminRoles } from "@/components/admin/AdminRoles";
import { AdminDeals } from "@/components/admin/AdminDeals";
import { AdminUsers } from "@/components/admin/AdminUsers";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAdmin, isOwner, loading } = useUserRole();
  const [viewAsUser, setViewAsUser] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/dashboard");
    return null;
  }

  if (viewAsUser) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-1">
                {isOwner ? "Owner Dashboard" : "Moderator Dashboard"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setViewAsUser(true);
              navigate("/dashboard");
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View as User
          </Button>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">
              <UserCog className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="chats">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="deals">
              <DollarSign className="h-4 w-4 mr-2" />
              Deals
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="roles">
                <Shield className="h-4 w-4 mr-2" />
                Roles
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, ban users, and delete accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUsers />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Management</CardTitle>
                <CardDescription>
                  View and manage all company profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCompanies />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats">
            <Card>
              <CardHeader>
                <CardTitle>Chat History</CardTitle>
                <CardDescription>
                  View all conversations between companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminChats />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <CardTitle>Deals Management</CardTitle>
                <CardDescription>
                  View all deals and assign penalties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminDeals />
              </CardContent>
            </Card>
          </TabsContent>

          {isOwner && (
            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>
                    Assign moderator roles to users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminRoles />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
