import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, MapPin, Phone, Globe, Mail, MessageSquare } from 'lucide-react';

interface Profile {
  business_name: string;
  business_type: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  email: string;
}

const CompanyProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/companies')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{profile.business_name}</CardTitle>
                {profile.business_type && (
                  <Badge variant="secondary" className="text-base">
                    {profile.business_type}
                  </Badge>
                )}
              </div>
              <Building2 className="h-12 w-12 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{profile.description}</p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <span>{profile.phone}</span>
                </div>
              )}
              
              {profile.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <span>{profile.email}</span>
                </div>
              )}
              
              {profile.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-primary" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {profile.website}
                  </a>
                </div>
              )}
            </div>

            <Button 
              className="w-full"
              onClick={() => navigate(`/chat/${userId}`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyProfile;