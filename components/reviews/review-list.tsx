import { Review, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
    reviews: (Review & { user: { name: string | null; image: string | null } })[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to review!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="flex gap-4 p-4 border rounded-xl bg-card">
                    <Avatar>
                        <AvatarImage src={review.user.image || ""} />
                        <AvatarFallback>{review.user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">{review.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                            </div>
                        </div>
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted-foreground"}`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
