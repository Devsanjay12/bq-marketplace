'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { VideoForm } from '@/components/z-video/video-form';
import { VideoPreview } from '@/components/z-video/video-preview';
import { ZImageSidebar } from '@/components/z-image/sidebar';

export default function ZVideoPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentGeneration, setCurrentGeneration] = useState<any>(null);

    const handleGenerate = async (data: any) => {
        setIsGenerating(true);

        try {
            // Create generation task
            const response = await fetch('/api/z-video/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Generation failed details:', errorData);
                throw new Error(errorData.error || 'Generation failed');
            }

            const { generationId } = await response.json();

            // Set initial state
            setCurrentGeneration({
                id: generationId,
                prompt: data.prompt,
                status: 'PENDING',
            });

            // Poll for status
            pollGenerationStatus(generationId);
        } catch (error: any) {
            alert(error.message);
            setIsGenerating(false);
        }
    };

    const pollGenerationStatus = async (generationId: string) => {
        const maxAttempts = 120; // 120 attempts = 4 minutes (videos take longer)
        let attempts = 0;

        const poll = async () => {
            if (attempts >= maxAttempts) {
                setIsGenerating(false);
                alert('Generation timeout. Please check history later.');
                return;
            }

            const response = await fetch(`/api/z-video/status?id=${generationId}`);
            const data = await response.json();

            setCurrentGeneration((prev: any) => ({
                ...prev,
                status: data.status,
                resultUrl: data.resultUrl,
                failReason: data.failReason,
            }));

            if (data.status === 'SUCCESS' || data.status === 'FAILED') {
                setIsGenerating(false);
            } else {
                attempts++;
                setTimeout(poll, 2000); // Poll every 2 seconds
            }
        };

        poll();
    };

    if (status === 'loading') {
        return <div className="h-screen w-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
            {/* Sidebar */}
            <ZImageSidebar />

            {/* Main Content Area (Control Panel) */}
            <div className="w-[480px] border-r border-[#2A2A2A] flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <VideoForm
                        onGenerate={handleGenerate}
                        isLoading={isGenerating}
                    />
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-black relative flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <VideoPreview
                        videoUrl={currentGeneration?.resultUrl}
                        prompt={currentGeneration?.prompt || ''}
                        status={currentGeneration?.status}
                        failReason={currentGeneration?.failReason}
                    />
                </div>
            </div>
        </div>
    );
}
