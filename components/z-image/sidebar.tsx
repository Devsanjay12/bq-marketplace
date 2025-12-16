'use client';

import { Home, Image as ImageIcon, Video, Music, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ZImageSidebar() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: ImageIcon, label: 'Images', href: '/z-image' },
        { icon: Video, label: 'Videos', href: '/z-video' },
        { icon: ImageIcon, label: 'Gallery', href: '/gallery' },
        { icon: Music, label: 'Audio', href: '#' },
        { icon: Star, label: 'Favorites', href: '#' },
    ];

    return (
        <div className="w-[70px] h-full bg-[#0A0A0A] border-r border-[#2A2A2A] flex flex-col items-center py-6 gap-8">
            {/* Logo / Brand */}
            <div className="w-10 h-10 rounded-full overflow-hidden mb-4 border border-[#2A2A2A]">
                <img src="/logo.jpg" alt="Blaqhole" className="w-full h-full object-cover" />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-6 w-full items-center">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-[#1A1A1A] text-[#00FF85]"
                                    : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                            )}
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={2} />
                            {isActive && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00FF85] rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Subscribe Badge / Credits */}
            <div className="flex flex-col items-center gap-2 mb-4 group relative cursor-help">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A] text-[#00FF85]">
                    <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-medium text-[#00FF85] uppercase tracking-wider">
                    Sub
                </span>

                {/* Credits Popup */}
                <div className="absolute left-full ml-4 bottom-0 w-32 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Credits</p>
                    <p className="text-lg font-bold text-white">1,250</p>
                    <p className="text-[10px] text-[#00FF85]">Pro Plan</p>

                    {/* Arrow pointing left */}
                    <div className="absolute top-6 -left-1.5 w-3 h-3 bg-[#1A1A1A] border-l border-b border-[#2A2A2A] rotate-45" />
                </div>
            </div>

            {/* User Profile */}
            <Link href="/profile" className="w-8 h-8 rounded-full bg-gray-700 mt-2 overflow-hidden hover:ring-2 hover:ring-[#00FF85] transition-all">
                {/* Placeholder avatar */}
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500" />
            </Link>
        </div>
    );
}
