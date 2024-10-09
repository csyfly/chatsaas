'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { SignedIn, SignedOut, UserButton, SignUpButton, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogPanel } from '@headlessui/react';
import NameTitle from '@/components/NameTitle';

const Header = ({ lang }: { lang: string }) => {
  const navigation = [
    // { name: 'Product', href: '#landvalue' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Templates', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#about' },
  ]

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <div className="flex items-center">
                <Image
                  alt="ChatSaaS"
                  src="/logo.png" 
                  width={40}
                  height={40}
                  className="h-10 w-10 mr-2"
                />
                <div>
                  <NameTitle />
                  <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-1 py-1 rounded-full ml-2">
                    Beta
                  </span>
                  <p className="text-xs text-gray-500">AI SaaS Starter Kit</p>
                </div>
              </div>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <SignedIn>
              <a href={`/${lang}/dashboard`} className="text-sm font-semibold leading-6 text-blue-500 mr-4 hover:text-blue-500 hover:underline transition-colors">
                Console
              </a>
              <UserButton></UserButton>
            </SignedIn>
            <SignedOut>
              <SignUpButton>
                <Button variant="ghost">Sign Up</Button>
              </SignUpButton>
              <SignInButton>
                <Button className="bg-blue-500 text-white">Sign In</Button>
              </SignInButton>
            </SignedOut>
            
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <Image
                  alt="ChatSaaS"
                  src="/logo.png"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <NameTitle />
                  <p className="text-xs text-gray-500">AI SaaS Personal Assistant</p>
                </div>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name} 
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <SignedIn>
                    <a href={`/${lang}/dashboard`} className="text-sm font-semibold leading-6 text-blue-500 mr-4 hover:text-blue-500 hover:underline transition-colors">
                      Console
                    </a>
                    <UserButton></UserButton>
                  </SignedIn>
                  <SignedOut>
                    <SignUpButton>
                      <Button variant="ghost">Sign Up</Button>
                    </SignUpButton>
                    <SignInButton>
                      <Button className="bg-blue-500 text-white">Sign In</Button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
  );
};

export default Header;
