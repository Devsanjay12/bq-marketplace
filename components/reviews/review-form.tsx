"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    toolId: string;
}

export function ReviewForm({ toolId }: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toolId, rating, comment }),
            });

            if (!res.ok) throw new Error("Failed to submit review");

            setRating(0);
            setComment("");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl bg-card">
            <h3 className="font-bold">Write a Review</h3>

            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                    >
                        <Star
                            className={`w-6 h-6 ${star <= (hoveredRating || rating)
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-muted-foreground"
                                }`}
                        />
                    </button>
                ))}
            </div>

            <Textarea
                placeholder="Share your experience with this tool..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />

            <Button type="submit" disabled={isSubmitting || rating === 0}>
                Submit Review
            </Button>
        </form>
    );
}
