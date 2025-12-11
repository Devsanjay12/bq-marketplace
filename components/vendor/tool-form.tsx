"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadButton } from "@/components/shared/uploadthing"; // Need to export this from lib/uploadthing.ts or create components/uploadthing.tsx
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// We need to create the UploadButton component first or import it correctly.
// Assuming we will create components/uploadthing.tsx shortly.
import { UploadDropzone } from "@/components/shared/uploadthing";

export function ToolForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, logo: logoUrl }),
            });

            if (!res.ok) throw new Error("Failed to create tool");

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto py-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">List Your Tool</h2>
                <p className="text-muted-foreground">Fill out the details below to add your AI tool to the marketplace.</p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Tool Name</Label>
                    <Input id="name" {...register("name", { required: true })} placeholder="e.g. SuperAI" />
                    {errors.name && <span className="text-red-500 text-sm">Required</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" {...register("company", { required: true })} placeholder="e.g. SuperAI Inc." />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description", { required: true })} placeholder="Describe your tool..." className="h-32" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select onValueChange={(v) => register("category").onChange({ target: { value: v, name: "category" } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CODING">Coding</SelectItem>
                                <SelectItem value="WRITING">Writing</SelectItem>
                                <SelectItem value="DESIGN">Design</SelectItem>
                                <SelectItem value="DATA">Data</SelectItem>
                                <SelectItem value="MARKETING">Marketing</SelectItem>
                                <SelectItem value="BUSINESS">Business</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Pricing Model</Label>
                        <Select onValueChange={(v) => register("pricingModel").onChange({ target: { value: v, name: "pricingModel" } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select pricing" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FREE">Free</SelectItem>
                                <SelectItem value="FREEMIUM">Freemium</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="OPENSOURCE">Open Source</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Logo</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-24 h-24 object-cover rounded-xl mb-4" />
                        ) : (
                            <UploadDropzone
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    setLogoUrl(res[0].url);
                                    alert("Upload Completed");
                                }}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input id="websiteUrl" {...register("websiteUrl", { required: true })} placeholder="https://..." />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !logoUrl}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Tool
            </Button>
        </form>
    );
}
