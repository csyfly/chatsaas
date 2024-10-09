'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { upgradePromoCode } from '@/actions/procode';
import { toast } from 'react-hot-toast';
import { useUserStore } from "@/store/userStore";
import { useParams } from 'next/navigation';

const UpgradePro = () => {
    const [proCode, setProCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);  // 新增状态控制对话框
    const { currentUser, reloadCurrentUser } = useUserStore();
    const { lang } = useParams();
    
    // if (!currentUser) {
    //     return <></>;
    // }

    const handleSubmit = async () => {
      if (!currentUser) {
        //toast.error('Please login first');
        window.location.href = `/${lang}/pro`;
        return;
      }
      if (proCode === '') {
        toast.error('Please enter a Pro Code');
        return;
      }
      setIsLoading(true);
      try {
        const result = await upgradePromoCode(proCode, currentUser?.id);
        toast.success('Upgrade Pro Success');
        setProCode('');
        setIsOpen(false);  // 提交成功后关闭对话框
        setIsLoading(false);
        reloadCurrentUser();
      } catch (error) {
        toast.error('Upgrade Pro Failed: ' + (error as Error).message);
        console.error('Upgrade Pro Failed: ' + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild >
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    {currentUser?.isPro ? 'Manage Pro' : 'Upgrade Pro'}
                </Button>
            </DialogTrigger>
            {!currentUser?.isPro ? <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter Pro Code</DialogTitle>
                    <DialogDescription>
                        Automated subscription is coming soon. Until then, you can contact our X account to get a trial ProCode.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        id="proCode"
                        value={proCode}
                        onChange={(e) => setProCode(e.target.value)}
                        placeholder="Enter your Pro Code"
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={isLoading}>Submit</Button>
                </DialogFooter>
              </DialogContent> 
              : <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Congratulations!</DialogTitle>
                    <DialogDescription className='text-green-500 h-20 items-center'>
                        You are a Pro user. Expires on {currentUser.proExpiredTime?.toLocaleDateString()}. Enjoy!
                    </DialogDescription>
                </DialogHeader>
              </DialogContent>}
        </Dialog>
    );
};

export default UpgradePro;
