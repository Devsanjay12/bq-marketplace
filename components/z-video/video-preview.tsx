'use client';

import { Download, Share2, Loader2, Video, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPreviewProps {
    videoUrl?: string;
    prompt: string;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    failReason?: string;
}

export function VideoPreview({
    videoUrl,
    prompt,
    status,
    failReason,
}: VideoPreviewProps) {
    const handleDownload = async () => {
        if (!videoUrl) return;

        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `z-video-${Date.now()}.mp4`;
        a.click();
    };

    const handleShare = async () => {
        if (!videoUrl) return;

        if (navigator.share) {
            await navigator.share({
                title: 'Generated Video',
                text: prompt,
                url: videoUrl,
            });
        } else {
            navigator.clipboard.writeText(videoUrl);
            alert('Video URL copied to clipboard!');
        }
    };

    if (status === 'PENDING' || status === 'PROCESSING') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#00FF85] blur-xl opacity-20 animate-pulse" />
                    <Loader2 className="h-16 w-16 animate-spin text-[#00FF85] relative z-10" />
                </div>
                <p className="text-xl font-medium mt-8">Rendering your video...</p>
                <p className="text-gray-500 mt-2 text-center max-w-xs">
                    This can take a minute or two. Sit tight!
                </p>
            </div>
        );
    }

    if (status === 'FAILED') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <Video className="h-10 w-10 text-red-500" />
                </div>
                <p className="text-xl font-medium text-red-500">Generation Failed</p>
                <p className="text-gray-500 mt-2 max-w-md text-center">{failReason}</p>
            </div>
        );
    }

    if (status === 'SUCCESS' && videoUrl) {
        return (
            <div className="h-full flex flex-col p-8">
                <div className="flex-1 relative rounded-2xl overflow-hidden border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center">
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        loop
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                    <p className="text-sm text-gray-400 line-clamp-2 flex-1 font-light">{prompt}</p>
                    <div className="flex gap-3">
                        <Button onClick={handleDownload} variant="outline" className="bg-[#1A1A1A] border-[#2A2A2A] text-white hover:bg-[#252525] hover:text-white">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button onClick={handleShare} variant="outline" className="bg-[#1A1A1A] border-[#2A2A2A] text-white hover:bg-[#252525] hover:text-white">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Empty State
    return (
        <div className="flex flex-col items-center justify-center h-full text-white opacity-50">
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-800 ml-2" fill="currentColor" />
                </div>
            </div>
            <p className="text-gray-600 text-lg font-light tracking-wide">
                Create cinematic videos with AI.
            </p>
            <p className="text-gray-700 text-sm mt-2">
                Powered by Wan 2.5 Text-to-Video.
            </p>
        </div>
    );
}
