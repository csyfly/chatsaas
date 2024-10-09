import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getFriendlyLinks } from '@/actions/link';
import { FriendlyLink } from '@prisma/client';

// 移除 'use client' 指令，使其成为服务端组件

async function FriendlyLinks({ lang }: { lang: string }) {
  // 直接在组件中获取数据
  const links = await getFriendlyLinks();

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-32">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold">Friendly AI Tools</h2>
          <Link href={`/${lang}/addlink`} aria-label="Add Friendly AI Tool Link" target='_blank'
            className="flex items-center ml-2 text-blue-500 hover:text-blue-600 transition-colors">
            <PlusCircle size={20} className="mr-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start p-2 rounded-lg transition-colors duration-300 hover:bg-gray-100"
              aria-label={`Visit ${link.url}`}
            >
              <Image
                src={link.logo || ''}
                alt={link.name}
                width={40}
                height={40}
                className="mr-2 flex-shrink-0"
              />
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-semibold mb-0 truncate">{link.name}</h3>
                <p className="text-gray-400 text-xs mb-0 truncate">{link.description}</p>
              </div>
            </a>
          ))}
          <Link
            href={`/${lang}/addlink`}
            className="flex items-center p-2 rounded-lg transition-colors duration-300 hover:bg-gray-100"
            aria-label="自助交换友情链接"
            target='_blank'
          >
            <div className="flex flex-row items-center justify-center">
              <PlusCircle size={40} className="text-blue-500 mr-2" />
              <span className="text-sm font-semibold text-blue-500">自助交换友情链接</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FriendlyLinks;