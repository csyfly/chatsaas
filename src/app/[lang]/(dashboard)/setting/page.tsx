'use client'
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/prisma";
import { useAuth } from '@/lib/auth';
import { getUser, updateUser } from '@/actions/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
// export const runtime = 'edge';

const SettingPage: React.FC = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const userData = await getUser(userId);
        setUser(userData);
      }
    };
    fetchUser();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => prevUser ? { ...prevUser, [name]: value } : null);
    setIsModified(true);
  };

  const handleSave = async () => {
    if (user && userId) {
      await updateUser(userId, user);
      console.log('用户信息已更新:', user);
      setIsSaved(true);
      setIsModified(false);
      setTimeout(() => setIsSaved(false), 5000); // 3秒后隐藏提示
    }
  };

  const handleGenderChange = (value: string) => {
    setUser(prevUser => prevUser ? { ...prevUser, gender: value } : null);
    setIsModified(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Personal Settings</TabsTrigger>
          <TabsTrigger value="model">Model Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="flex items-center space-x-4 max-w-md">
              <label htmlFor="name" className="w-1/4">Name</label>
              <Input
                id="name"
                name="name"
                value={user?.name || ''}
                placeholder="Enter your name"
                className="w-3/4"
                disabled
              />
            </div>
            <div className="flex items-center space-x-4 max-w-md">
              <label htmlFor="email" className="w-1/4">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user?.email || ''}
                placeholder="Enter your email"
                className="w-3/4"
                disabled
              />
            </div>
            <div className="flex items-center space-x-4 max-w-md">
              <label htmlFor="gender" className="w-1/4">Gender</label>
              <Select onValueChange={handleGenderChange} value={user?.gender || ''}>
                <SelectTrigger className="w-3/4">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="man">Man</SelectItem>
                  <SelectItem value="woman">Woman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4 max-w-md">
              <label htmlFor="job" className="w-1/4">Job</label>
              <Input
                id="job"
                name="job"
                value={user?.job || ''}
                onChange={handleInputChange}
                placeholder="Enter your job"
                className="w-3/4"
              />
            </div>
            <div className="flex items-center space-x-4 max-w-md">
              <label htmlFor="position" className="w-1/4">Position</label>
              <Input
                id="position"
                name="position"
                value={user?.position || ''}
                onChange={handleInputChange}
                placeholder="Enter your position"
                className="w-3/4"
              />
            </div>
            <div className="flex items-center space-x-4 max-w-md">
              <label htmlFor="skill" className="w-1/4">Skills</label>
              <Input
                id="skill"
                name="skill"
                value={user?.skill || ''}
                onChange={handleInputChange}
                placeholder="Enter your skills (comma-separated)"
                className="w-3/4"
              />
            </div>
            <div className="flex items-center space-x-4 max-w-md">
              <label htmlFor="personality" className="w-1/4">Personality</label>
              <Input
                id="personality"
                name="personality"
                value={user?.personality || ''}
                onChange={handleInputChange}
                placeholder="Describe your personality"
                className="w-3/4"
              />
            </div>
            <p className="text-sm text-red-600 italic mt-4 mb-6">
              Complete your personal information to help our AI better understand and assist you. The more details you provide, the more tailored and effective our support can be.
            </p>
            <Button 
              variant="default" 
              className={cn("bg-blue-500", {"opacity-50 cursor-not-allowed": !isModified})}
              onClick={handleSave}
              disabled={!isModified}
            >
              Save Changes
            </Button>
            {isSaved && (
              <p className="text-green-500 mt-2 text-sm">Save Success!</p>
            )}
          </form>
        </TabsContent>
        <TabsContent value="model">
          <p>Model settings content goes here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingPage;
