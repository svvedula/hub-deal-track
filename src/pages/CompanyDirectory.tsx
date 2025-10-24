import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, MapPin, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CompanyProfile {
  user_id: string;
  business_name: string;
  business_type: string | null;
  description: string | null;
  location: string | null;
  email: string;
}

const CompanyDirectory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingTestCompanies, setIsCreatingTestCompanies] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, business_name, business_type, description, location, email')
      .neq('user_id', user!.id);

    if (data) {
      setCompanies(data);
    }
  };

  const createTestCompanies = async () => {
    setIsCreatingTestCompanies(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-test-companies');
      
      if (error) throw error;
      
      toast.success('Test companies created successfully!');
      fetchCompanies();
    } catch (error) {
      console.error('Error creating test companies:', error);
      toast.error('Failed to create test companies');
    } finally {
      setIsCreatingTestCompanies(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.business_type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Company Directory</h1>
            <p className="text-muted-foreground">Connect with other businesses</p>
          </div>
          <Button 
            onClick={createTestCompanies}
            disabled={isCreatingTestCompanies}
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isCreatingTestCompanies ? 'Creating...' : 'Add Test Companies'}
          </Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.user_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{company.business_name}</CardTitle>
                    {company.business_type && (
                      <Badge variant="secondary" className="mb-2">
                        {company.business_type}
                      </Badge>
                    )}
                  </div>
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {company.location}
                  </div>
                )}
                {company.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {company.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/profile/${company.user_id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => navigate(`/chat/${company.user_id}`)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No companies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDirectory;