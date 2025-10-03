import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type UserRole = "owner" | "moderator" | "user" | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .order("role", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching role:", error);
          setRole("user");
        } else if (data) {
          setRole(data.role as UserRole);
        } else {
          setRole("user");
        }
      } catch (error) {
        console.error("Error:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const isAdmin = role === "owner" || role === "moderator";
  const isOwner = role === "owner";

  return { role, isAdmin, isOwner, loading };
};
