'use client'
import React, { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import UpgradePro from '@/components/UpgradePro';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '@/components/ui/input';
import { joinWaitlist } from '@/actions/join';
import { useUser } from '@clerk/nextjs';

const Pricing = () => {
  const pathname = usePathname();
  const { lang } = useParams();
  const isProPage = pathname.includes('/pro');
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setEmail(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [user]);

  const handleJoinWaitlist = async () => {
    try {
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage('Please enter a valid email address');
        return;
      }
      if (await joinWaitlist(email)) {
        setMessage('Successfully joined the waitlist!');
        // setIsWaitlistOpen(false);
      } else {
        setMessage('You are already on the waitlist!');
      }
    } catch (error) {
      console.error('Join waitlist failed:', error);
      setMessage('Join waitlist failed, please try again later.');
    }
  };

  return (
    <div className="bg-white py-16" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Free</h2>
            <p className="text-3xl font-bold mb-2">$0</p>
            <p className="text-gray-500 mb-4">Forever</p>
            <ul className="mb-6">
              {["100 AI conversations/month", "1 project", "Free to use"].map((feature, index) => (
                <li key={index} className="mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a href={`/${lang}/dashboard`}>
              <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-md hover:from-blue-500 hover:to-blue-700 transition duration-300">
                Get Started
              </button>
            </a>
          </div>

          {/* Pro Tier */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Pro</h2>
            <p className="text-3xl font-bold mb-2">
              <span className='text-sm text-gray-400'>Monthly </span>
              <span className="line-through text-gray-400">$19</span>{" "}
              <span className="text-xs text-red-500">Limited Offer</span>
              <span className="text-blue-500">$9.9</span>
            </p>
            <p className="text-gray-500 mb-4">
              Yearly 
              <span className="line-through text-sm text-gray-500">$199</span>{" "}
              <span className="text-xs text-red-500">Limited Offer</span>
              <span className="text-blue-500">$99</span>
            </p>
            <ul className="mb-6">
              {[`1000 AI conversations/month`, "Unlimited projects", "Priority support"].map((feature, index) => (
                <li key={index} className="mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            {!isProPage ? (
              <Link href={`/${lang}/pro`}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Upgrade Pro
                </Button>
              </Link>
            ) : (
              <UpgradePro />
            )}
          </div>

          {/* Team Tier */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Team</h2>
            <p className="text-3xl font-bold mb-2">Coming Soon</p>
            <p className="text-gray-500 mb-4">Wait</p>
            <ul className="mb-6">
              {["More features", "Team collaboration", "Advanced management"].map((feature, index) => (
                <li key={index} className="mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-2 rounded-md hover:from-green-500 hover:to-green-700 transition duration-300"
              onClick={() => setIsWaitlistOpen(true)}
            >
              Join Waitlist
            </button>
          </div>

          <Dialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Waitlist</DialogTitle>
              </DialogHeader>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
              <DialogFooter>
                <Button onClick={handleJoinWaitlist} disabled={!email} className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
