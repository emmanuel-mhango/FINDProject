
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ResumeUploaderProps {
  onFileUploaded: (fileData: string, fileName: string) => void;
  existingFileName?: string;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ 
  onFileUploaded,
  existingFileName 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(existingFileName || null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF or Word document",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setFileName(file.name);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onFileUploaded(event.target.result as string, file.name);
            setIsUploading(false);
            
            toast({
              title: "File uploaded",
              description: "Your resume has been uploaded successfully",
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }, 300);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = () => {
    setFileName(null);
    setUploadProgress(0);
    onFileUploaded('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle className="text-lg">Resume / CV</CardTitle>
        <CardDescription>Upload your resume for job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          {!fileName ? (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop your resume or click to browse
              </p>
              <p className="text-xs text-gray-400 mb-4">
                PDF or Word documents only (max 5MB)
              </p>
              <Button onClick={triggerFileInput}>
                Select File
              </Button>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-red-500"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <FileX size={16} />
                </Button>
              </div>
              
              {isUploading ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              ) : (
                <div className="bg-green-100 text-green-800 text-xs rounded px-2 py-1 inline-flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  File uploaded successfully
                </div>
              )}
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx" 
            className="hidden" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
