import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface BankStatementUploadProps {
  onAnalysisComplete: () => void;
}

export default function BankStatementUpload({ onAnalysisComplete }: BankStatementUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['text/plain', 'text/csv', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, CSV, or TXT file containing your bank statement.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(20);

    try {
      // Read file content
      const fileContent = await file.text();
      setUploadProgress(50);
      setUploadStatus('analyzing');

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call AI analysis function
      const { data, error } = await supabase.functions.invoke('analyze-bank-statement', {
        body: {
          bankStatementText: fileContent,
          filename: file.name
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw new Error(error.message || 'Failed to analyze bank statement');
      }

      // Handle graceful failures (e.g., rate limit) returned as 200
      if (data && data.success === false) {
        setUploadStatus('error');
        setUploadProgress(100);
        toast({
          title: 'Analysis unavailable',
          description: data.error || 'The analysis service is temporarily unavailable. Please try again shortly.',
          variant: 'destructive',
        });
        return;
      }

      setUploadProgress(100);
      setUploadStatus('complete');

      toast({
        title: "Analysis complete!",
        description: "Your bank statement has been processed and insights generated.",
      });

      onAnalysisComplete();

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to analyze bank statement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      
      // Reset form after a delay
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
        // Reset file input
        if (event.target) {
          event.target.value = '';
        }
      }, 3000);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'analyzing':
        return <Upload className="h-5 w-5 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading file...';
      case 'analyzing':
        return 'AI is analyzing your bank statement...';
      case 'complete':
        return 'Analysis complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Upload Bank Statement';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          AI-Powered Bank Statement Analysis
        </CardTitle>
        <CardDescription>
          Upload your bank statement for automatic transaction extraction and spending insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <Input
              type="file"
              accept=".pdf,.csv,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="bank-statement-upload"
            />
            <label
              htmlFor="bank-statement-upload"
              className={`cursor-pointer ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="space-y-2">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                <div className="text-sm font-medium">{getStatusText()}</div>
                <div className="text-xs text-muted-foreground">
                  Supports PDF, CSV, and TXT files (max 10MB)
                </div>
              </div>
            </label>
          </div>

          {uploadStatus !== 'idle' && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <div className="text-xs text-muted-foreground text-center">
                {uploadStatus === 'analyzing' && 'This may take a minute...'}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Your data is processed securely and never stored permanently</p>
            <p>• AI extracts transactions, categorizes spending, and provides insights</p>
            <p>• Supports most major bank statement formats</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}