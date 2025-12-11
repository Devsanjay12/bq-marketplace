import { Code, PenTool, Image as ImageIcon, Database, Megaphone, Briefcase, Mic, Video, Bot, GraduationCap, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const categories = [
    { name: "Coding", icon: Code, slug: "coding", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Writing", icon: PenTool, slug: "writing", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Design", icon: ImageIcon, slug: "design", color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Data", icon: Database, slug: "data", color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Marketing", icon: Megaphone, slug: "marketing", color: "text-pink-500", bg: "bg-pink-500/10" },
    { name: "Business", icon: Briefcase, slug: "business", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Audio", icon: Mic, slug: "audio", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "Video", icon: Video, slug: "video", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "Agents", icon: Bot, slug: "agents", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { name: "Education", icon: GraduationCap, slug: "education", color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export function CategoryList() {
    return (
        <section className="py-8">
            <h2 className="text-xl font-bold tracking-tight mb-4 px-1">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
                    >
                        <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                            <cat.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
