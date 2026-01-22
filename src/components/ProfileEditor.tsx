import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import ResumeUploader from './ResumeUploader';
import { malawianUniversities } from '@/data/universities';

interface ProfileEditorProps {
  userData?: any;
  onSave: (updatedData: any) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ userData, onSave, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    userType: userData?.userType || 'student', // student or non-student
    university: userData?.university || '',
    registrationNumber: userData?.registrationNumber || '',
    bio: userData?.bio || '',
  });
  const [resumeUrl, setResumeUrl] = useState<string | null>(userData?.resume_url || null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(userData?.resume_file_name || null);
  const [certifications, setCertifications] = useState<{ name: string; data: string }[]>(
    userData?.certifications || []
  );
  const [profilePicture, setProfilePicture] = useState<string | null>(userData?.profilePicture || null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeUpload = async (fileData: string, fileName: string) => {
    if (!userId) return;
    
    try {
      if (fileData) {
        setResumeUrl(fileData);
        setResumeFileName(fileName);
      } else {
        setResumeUrl(null);
        setResumeFileName(null);
      }
    } catch (err: any) {
      console.error('Resume upload failed:', err);
    }
  };

  const handleCertificationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Please select a file smaller than 5MB");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please select a PDF or Word document");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCertifications((prev) => [
            ...prev,
            { name: file.name, data: String(event.target?.result || '') },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveCertification = (name: string) => {
    setCertifications((prev) => prev.filter((cert) => cert.name !== name));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Please select an image smaller than 5MB");
      setUploading(false);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("Invalid file type. Please select an image file");
      setUploading(false);
      return;
    }

    // Convert to base64 for storage (in a real app, would upload to a server)
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfilePicture(event.target.result as string);
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Required fields missing. Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    (async () => {
      try {
        if (!userId) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            user_id: userId,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone || null,
            university: formData.university || null,
          }, { onConflict: 'id' });

        if (error) throw error;

        const updatedData = {
          ...userData,
          ...formData,
          profilePicture,
          resume_url: resumeUrl,
          resume_file_name: resumeFileName,
          certifications
        };

        onSave(updatedData);
      } catch (err: any) {
        alert('Save failed: ' + (err.message || 'Unable to save profile'));
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-find-red to-red-600 text-white">
        <CardTitle className="flex items-center text-white">
          <User className="w-6 h-6 mr-2" />
          Edit Profile
        </CardTitle>
        <CardDescription className="text-red-100">
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar className="h-32 w-32 cursor-pointer ring-4 ring-gray-100 transition-all duration-300 hover:ring-find-red/30" onClick={triggerFileInput}>
                {profilePicture ? (
                  <AvatarImage src={profilePicture} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200">
                    <User size={64} className="text-gray-500" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className="absolute bottom-2 right-2 bg-find-red text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
                onClick={triggerFileInput}
              >
                <Upload size={16} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              className="mt-3 text-sm text-gray-600 hover:text-find-red hover:bg-red-50"
              onClick={triggerFileInput}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Change Profile Picture"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="h-11 border-gray-300 focus:border-find-red focus:ring-find-red"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="h-11 border-gray-300 focus:border-find-red focus:ring-find-red"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11 border-gray-300 focus:border-find-red focus:ring-find-red"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-find-red focus:ring-find-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm font-semibold text-gray-700">
                User Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.userType} onValueChange={(value) => handleSelectChange('userType', value)}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-find-red focus:ring-find-red">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="non-student">Non-Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.userType === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
              <div className="space-y-2">
                <Label htmlFor="university" className="text-sm font-semibold text-gray-700">
                  University <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.university} onValueChange={(value) => handleSelectChange('university', value)}>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-find-red focus:ring-find-red">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Public Universities</div>
                    {malawianUniversities
                      .filter(uni => uni.type === 'Public')
                      .map((uni) => (
                        <SelectItem key={uni.value} value={uni.value}>
                          {uni.label}
                        </SelectItem>
                      ))}
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">Private Universities</div>
                    {malawianUniversities
                      .filter(uni => uni.type === 'Private')
                      .map((uni) => (
                        <SelectItem key={uni.value} value={uni.value}>
                          {uni.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="text-sm font-semibold text-gray-700">
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g., UNIMA/CS/2022/001"
                  className="h-11 border-gray-300 focus:border-find-red focus:ring-find-red"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself, your interests, and what you're looking for..."
              className="resize-none border-gray-300 focus:border-find-red focus:ring-find-red min-h-[120px]"
              rows={4}
            />
            <p className="text-xs text-gray-500">Share a bit about yourself to help others understand you better.</p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 h-11 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 h-11 bg-find-red hover:bg-red-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Resume / CV</h3>
          <ResumeUploader
            onFileUploaded={handleResumeUpload}
            existingFileName={resumeFileName || undefined}
          />
          {resumeUrl && (
            <p className="text-sm text-green-600 mt-2">Resume uploaded successfully</p>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Certifications</h3>
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="cert_upload" className="text-sm font-semibold text-gray-700">
                    Upload certification documents
                  </Label>
                  <Input
                    id="cert_upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleCertificationUpload}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-2">PDF or Word documents only (max 5MB)</p>
                </div>
                {certifications.length > 0 && (
                  <div className="space-y-2">
                    {certifications.map((cert) => (
                      <div
                        key={cert.name}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="truncate">{cert.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCertification(cert.name)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
