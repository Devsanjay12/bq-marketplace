'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AspectRatioSelector } from './aspect-ratio-selector';
import { Loader2, ChevronDown, Settings2, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationFormProps {
    onGenerate: (prompt: string, aspectRatio: string) => void;
    isLoading: boolean;
}

export function GenerationForm({ onGenerate, isLoading }: GenerationFormProps) {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [activeTab, setActiveTab] = useState('text-to-image');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<{ src: string, prompt: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt, aspectRatio);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const hints = ["Manor Escape", "The Cat's Question", "Cyberpunk City", "Neon Forest"];

    // Example images from public/gallery-examples
    const examples = [
        { src: '/gallery-examples/uploaded_image_0_1765839437791.jpg', prompt: 'A serene portrait of a woman in soft sunlight' },
        { src: '/gallery-examples/uploaded_image_1_1765839437791.jpg', prompt: 'Ancient Chinese architecture with golden roofs' },
        { src: '/gallery-examples/uploaded_image_2_1765839437791.jpg', prompt: 'Fantasy character in green dress with butterflies' },
        { src: '/gallery-examples/uploaded_image_3_1765839437791.jpg', prompt: 'Man reading a magazine in a tailor shop' },
        { src: '/gallery-examples/uploaded_image_4_1765839437791.jpg', prompt: 'Portrait of a woman with coffee in urban setting' },
    ];

    return (
        <div className="flex flex-col h-full text-white relative">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">AI Image Generator</h1>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] rounded-full border border-[#2A2A2A] text-sm">
                        <span className="text-gray-300">Z-Image Turbo</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-[#2A2A2A] mb-6">
                    {[
                        { id: 'text-to-image', label: 'Text to Image' },
                        { id: 'image-reference', label: 'Image Reference' },
                        { id: 'examples', label: 'Examples' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "pb-3 text-sm font-medium transition-colors relative",
                                activeTab === tab.id ? "text-white" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 space-y-6">
                    {activeTab === 'text-to-image' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="prompt" className="text-gray-400 font-normal">Prompt (Required)</Label>
                                <button type="button" className="text-xs text-[#00FF85] hover:underline flex items-center gap-1 bg-[#1A1A1A] px-2 py-1 rounded-full border border-[#2A2A2A] hover:border-[#00FF85] transition-colors">
                                    <Sparkles className="w-3 h-3" /> AI Assistant
                                </button>
                            </div>
                            <div className="relative">
                                <Textarea
                                    id="prompt"
                                    placeholder="Please describe your creative ideas for the image..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    maxLength={1000}
                                    rows={8}
                                    className="bg-[#151515] border-[#2A2A2A] focus:border-[#00FF85] text-white placeholder:text-gray-600 resize-none p-4 text-base rounded-xl transition-colors"
                                    disabled={isLoading}
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                                    {prompt.length}/1000
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'image-reference' && (
                        <div className="space-y-4">
                            <Label className="text-gray-400 font-normal">Upload Reference Image</Label>
                            <div className="border-2 border-dashed border-[#2A2A2A] rounded-xl p-8 flex flex-col items-center justify-center bg-[#151515] hover:border-[#00FF85] transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {previewUrl ? (
                                    <div className="relative w-full h-48">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm">Click to change</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-300 font-medium">Click or drag image here</p>
                                        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG up to 5MB</p>
                                    </>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ref-prompt" className="text-gray-400 font-normal">Additional Prompt</Label>
                                <Textarea
                                    id="ref-prompt"
                                    placeholder="Describe how to use this reference..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={3}
                                    className="bg-[#151515] border-[#2A2A2A] focus:border-[#00FF85] text-white"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'examples' && (
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                            {examples.map((ex, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setLightboxImage(ex)}
                                    className="relative aspect-square rounded-lg overflow-hidden group border border-[#2A2A2A] hover:border-[#00FF85] transition-all cursor-pointer"
                                >
                                    <img src={ex.src} alt={ex.prompt} className="w-full h-full object-cover pointer-events-none" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 pointer-events-none">
                                        <p className="text-[10px] text-white line-clamp-2 text-left">{ex.prompt}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Hints (only for text-to-image) */}
                    {activeTab === 'text-to-image' && (
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
                            <button type="button" className="p-1.5 hover:bg-[#1A1A1A] rounded-full text-gray-500">
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        </div>
                    )}
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
                            <Label className="text-xs text-gray-500">Count</Label>
                            <div className="relative">
                                <select
                                    className="w-full h-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 text-sm text-gray-300 appearance-none focus:border-[#00FF85] focus:outline-none transition-colors"
                                    disabled={isLoading}
                                >
                                    <option value="1">1 Image</option>
                                    <option value="2">2 Images</option>
                                    <option value="3">3 Images</option>
                                    <option value="4">4 Images</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Quality</Label>
                            <div className="h-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg flex items-center justify-between px-3 text-sm text-gray-300 cursor-not-allowed opacity-70">
                                <span>High-Res</span>
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            </div>
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
                                Generating...
                            </>
                        ) : (
                            'Generate'
                        )}
                    </Button>
                </div>
            </form>

            {/* Lightbox */}
            {lightboxImage && (
                <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-[#00FF85]"
                    >
                        Close
                    </button>
                    <div className="relative w-full max-w-md aspect-square mb-4 rounded-xl overflow-hidden border border-[#2A2A2A]">
                        <img src={lightboxImage.src} alt={lightboxImage.prompt} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm text-gray-300 text-center mb-6 max-w-md">{lightboxImage.prompt}</p>
                    <Button
                        onClick={() => {
                            setPrompt(lightboxImage.prompt);
                            setActiveTab('text-to-image');
                            setLightboxImage(null);
                        }}
                        className="bg-[#00FF85] text-black hover:bg-[#00CC6A]"
                    >
                        Use this Style
                    </Button>
                </div>
            )}
        </div>
    );
}
