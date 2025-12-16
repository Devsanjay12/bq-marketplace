'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AspectRatioSelector } from '@/components/z-image/aspect-ratio-selector';
import { Loader2, ChevronDown, Sparkles, RefreshCw, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface VideoFormProps {
    onGenerate: (data: any) => void;
    isLoading: boolean;
}

export function VideoForm({ onGenerate, isLoading }: VideoFormProps) {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [duration, setDuration] = useState('5');
    const [resolution, setResolution] = useState('720p');
    const [enableExpansion, setEnableExpansion] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate({
                prompt,
                aspectRatio,
                duration,
                resolution,
                enablePromptExpansion: enableExpansion
            });
        }
    };

    const hints = ["Cinematic drone shot", "Cyberpunk street rain", "Slow motion water drop", "Time lapse clouds"];

    return (
        <div className="flex flex-col h-full text-white">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">AI Video Generator</h1>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] rounded-full border border-[#2A2A2A] text-sm">
                        <span className="text-gray-300">WAN 2.5</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                </div>

                <div className="flex gap-6 border-b border-[#2A2A2A] mb-6">
                    <button className="pb-3 text-sm font-medium text-white relative">
                        Text to Video
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
                    </button>
                    <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-300 relative">
                        Image to Video
                        <span className="ml-1.5 text-[10px] text-red-500">●</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="prompt" className="text-gray-400 font-normal">Prompt (Required)</Label>
                            <button type="button" className="text-xs text-[#00FF85] hover:underline flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Enhance
                            </button>
                        </div>
                        <div className="relative">
                            <Textarea
                                id="prompt"
                                placeholder="Describe the video you want to generate... (e.g., 'A cinematic drone shot of a futuristic city at night')"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                maxLength={800}
                                rows={6}
                                className="bg-[#151515] border-[#2A2A2A] focus:border-[#00FF85] text-white placeholder:text-gray-600 resize-none p-4 text-base rounded-xl transition-colors"
                                disabled={isLoading}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                                {prompt.length}/800
                            </div>
                        </div>
                    </div>

                    {/* Hints */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">Hints:</span>
                        {hints.map((hint) => (
                            <button
                                key={hint}
                                type="button"
                                onClick={() => setPrompt(hint)}
                                className="px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-xs text-gray-300 hover:bg-[#252525] hover:border-gray-600 transition-all whitespace-nowrap"
                            >
                                {hint}
                            </button>
                        ))}
                    </div>

                    {/* Advanced Settings */}
                    <div className="bg-[#151515] p-4 rounded-xl border border-[#2A2A2A] space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm text-gray-300">Prompt Expansion</Label>
                                <p className="text-xs text-gray-500">Use AI to enhance your prompt details</p>
                            </div>
                            <Switch
                                checked={enableExpansion}
                                onCheckedChange={setEnableExpansion}
                                className="data-[state=checked]:bg-[#00FF85]"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Control Bar */}
                <div className="mt-auto pt-6 border-t border-[#2A2A2A] space-y-4">
                    {/* Aspect Ratio - Full Width */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">Aspect Ratio</Label>
                        <AspectRatioSelector
                            value={aspectRatio}
                            onChange={setAspectRatio}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Duration</Label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full h-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 text-sm text-gray-300 focus:border-[#00FF85] outline-none appearance-none"
                                disabled={isLoading}
                            >
                                <option value="5">5 Seconds</option>
                                <option value="10">10 Seconds</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Resolution</Label>
                            <select
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                className="w-full h-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 text-sm text-gray-300 focus:border-[#00FF85] outline-none appearance-none"
                                disabled={isLoading}
                            >
                                <option value="720p">720p</option>
                                <option value="1080p">1080p</option>
                            </select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!prompt.trim() || isLoading}
                        className="w-full h-12 bg-[#00FF85] hover:bg-[#00CC6A] text-black font-semibold text-base rounded-xl transition-all hover:scale-[0.99] active:scale-[0.97]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating Video...
                            </>
                        ) : (
                            'Generate Video'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
