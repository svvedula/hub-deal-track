import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_profile: { business_name: string } | null;
  receiver_profile: { business_name: string } | null;
}

export const AdminChats = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // First get all messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (messagesError) throw messagesError;

      // Then get profiles for all unique user IDs
      const uniqueUserIds = Array.from(
        new Set([
          ...messagesData.map((m) => m.sender_id),
          ...messagesData.map((m) => m.receiver_id),
        ])
      );

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, business_name")
        .in("user_id", uniqueUserIds);

      if (profilesError) throw profilesError;

      // Map profiles to a lookup object
      const profilesMap: Record<string, { business_name: string }> = {};
      profilesData?.forEach((p) => {
        profilesMap[p.user_id] = { business_name: p.business_name };
      });

      // Combine the data
      const enrichedMessages = messagesData.map((msg) => ({
        ...msg,
        sender_profile: profilesMap[msg.sender_id] || null,
        receiver_profile: profilesMap[msg.receiver_id] || null,
      }));

      setMessages(enrichedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading chat history...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="font-medium">
                {message.sender_profile?.business_name || "Unknown"}
              </TableCell>
              <TableCell>
                {message.receiver_profile?.business_name || "Unknown"}
              </TableCell>
              <TableCell className="max-w-md truncate">
                {message.content}
              </TableCell>
              <TableCell>
                {format(new Date(message.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
