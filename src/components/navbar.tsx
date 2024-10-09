'use client'
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Home, BarChart2, Settings, FileText, Calendar, MessageSquare, Folder, Goal } from 'lucide-react';
import Link from "next/link";
import { useParams, usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const { lang } = useParams();

  const NavItem = ({ href, icon: Icon, children }: 
    { href: string; icon: React.ElementType; children: React.ReactNode }) => {
    const isActive = pathname.includes(href);
    return (
      <Link
        href={href}
        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 ${
          isActive ? 'bg-indigo-800' : ''
        }`}
      >
        <Icon className="inline-block mr-2" size={20} /> {children}
      </Link>
    );
  };

  return (
    <nav className="mt-0">
      <NavItem href={`/${lang}/dashboard`} icon={Home}>Home</NavItem>
      <NavItem href={`/${lang}/demo`} icon={Goal}>Demo</NavItem>
      <NavItem href={`/${lang}/tpl`} icon={FileText}>Template</NavItem>
      <NavItem href={`/${lang}/project`} icon={Folder}>Project</NavItem>
      <NavItem href={`/${lang}/setting`} icon={Settings}>Setting</NavItem>
    </nav>
  )
}

export default Navbar;