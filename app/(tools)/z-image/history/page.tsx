'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function ZImageHistoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [generations, setGenerations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/z-image/history');
        } else if (status === 'authenticated') {
            fetchHistory();
        }
    }, [status, router]);

    const fetchHistory = async () => {
        try {
            const response = await fetch('/api/z-image/history');
            const data = await response.json();
            setGenerations(data.generations || []);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return <div className="container py-8">Loading history...</div>;
    }

    return (
        <div className="container max-w-6xl py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/z-image">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Generation History</h1>
                    <p className="text-muted-foreground">
                        Your past AI image generations
                    </p>
                </div>
            </div>

            {generations.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No generations yet.</p>
                    <Link href="/z-image">
                        <Button>Create your first image</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generations.map((gen) => (
                        <Card key={gen.id} className="overflow-hidden group">
                            <div className="relative aspect-square bg-muted">
                                {gen.status === 'SUCCESS' && gen.resultUrl ? (
                                    <Image
                                        src={gen.resultUrl}
                                        alt={gen.prompt}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        {gen.status}
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <p className="text-sm line-clamp-2 mb-2 font-medium" title={gen.prompt}>
                                    {gen.prompt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDistanceToNow(new Date(gen.createdAt), { addSuffix: true })}
                                    </div>
                                    <span>{gen.aspectRatio}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
