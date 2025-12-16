'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ZImageSidebar } from '@/components/z-image/sidebar';
import { Loader2, Image as ImageIcon, Video, Download, Share2, Play } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function GalleryPage() {
    const { data: session, status } = useSession();
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch('/api/gallery');
                const data = await response.json();
                if (data.items) {
                    setItems(data.items);
                }
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchGallery();
        } else if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status]);

    const filteredItems = items.filter(item => filter === 'all' || item.type === filter);

    const handleDownload = async (url: string, type: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `z-${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
        a.click();
    };

    if (status === 'loading') return <div className="h-screen w-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
            <ZImageSidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="h-16 border-b border-[#2A2A2A] flex items-center justify-between px-8 bg-[#0A0A0A]">
                    <h1 className="text-xl font-semibold text-white">My Gallery</h1>
                    <div className="flex gap-2">
                        {['all', 'image', 'video'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
                                    filter === f
                                        ? "bg-[#1A1A1A] text-[#00FF85] border border-[#2A2A2A]"
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                {f}s
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00FF85]" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p>No generations found yet.</p>
                            <p className="text-sm mt-2">Create something amazing to see it here!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="group relative aspect-square bg-[#151515] rounded-xl overflow-hidden border border-[#2A2A2A]">
                                    {item.type === 'image' ? (
                                        <Image
                                            src={item.url}
                                            alt={item.prompt}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            onMouseOver={e => e.currentTarget.play()}
                                            onMouseOut={e => e.currentTarget.pause()}
                                        />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 rounded-full bg-black/50 hover:bg-[#00FF85] hover:text-black text-white"
                                                onClick={() => handleDownload(item.url, item.type)}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {item.type === 'video' ? <Video className="w-3 h-3 text-[#00FF85]" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                                                <span className="text-[10px] uppercase tracking-wider text-gray-300">{item.aspectRatio}</span>
                                            </div>
                                            <p className="text-xs text-white line-clamp-2 font-light">{item.prompt}</p>
                                        </div>
                                    </div>

                                    {item.type === 'video' && (
                                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white pointer-events-none group-hover:opacity-0">
                                            <Play className="w-3 h-3 fill-current" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
