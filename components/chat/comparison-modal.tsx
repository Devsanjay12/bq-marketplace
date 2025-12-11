"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useComparison } from "@/lib/context/comparison-context";
import { Button } from "@/components/ui/button";
import { Check, X, ExternalLink, Zap, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComparisonModal() {
    const { isComparisonOpen, setComparisonOpen, selectedTools, clearSelection } = useComparison();

    if (selectedTools.length === 0) return null;

    return (
        <Dialog open={isComparisonOpen} onOpenChange={setComparisonOpen}>
            <DialogContent className="max-w-5xl w-full h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Compare Tools</span>
                        <Button variant="ghost" size="sm" onClick={clearSelection} className="text-muted-foreground text-xs">
                            Clear All
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {selectedTools.map((tool, i) => (
                        <div key={i} className="border border-border rounded-lg p-4 bg-card/50 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{tool.name}</h3>
                                    <Badge variant="outline" className="mt-1">{tool.pricingModel}</Badge>
                                </div>
                                {tool.websiteUrl && (
                                    <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Description</h4>
                                    <p className="text-sm">{tool.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-primary/5 p-2 rounded border border-primary/10">
                                        <h4 className="text-xs font-semibold uppercase text-primary mb-1 flex items-center gap-1">
                                            <Zap className="h-3 w-3" /> Features
                                        </h4>
                                        <p className="text-xs line-clamp-3">
                                            {Array.isArray(tool.features) ? tool.features.join(", ") : "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-destructive/5 p-2 rounded border border-destructive/10">
                                        <h4 className="text-xs font-semibold uppercase text-destructive mb-1 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" /> Limitations
                                        </h4>
                                        <p className="text-xs line-clamp-3">
                                            {Array.isArray(tool.limitations) ? tool.limitations.join(", ") : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Pricing</h4>
                                    <p className="text-sm">
                                        {typeof tool.pricingDetails === 'string' ? tool.pricingDetails : JSON.stringify(tool.pricingDetails)}
                                    </p>
                                </div>

                                {tool.roi && (
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Est. ROI</h4>
                                        <div className="text-sm grid grid-cols-2 gap-2">
                                            <div className="bg-muted p-2 rounded">
                                                <span className="block text-xs text-muted-foreground">Hours Saved</span>
                                                <span className="font-mono font-bold">{tool.roi.estimated_hours_saved}/wk</span>
                                            </div>
                                            <div className="bg-muted p-2 rounded">
                                                <span className="block text-xs text-muted-foreground">Cost</span>
                                                <span className="font-mono font-bold">${tool.roi.cost_per_month}/mo</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {tool.compatibility && (
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Stack Fit</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {tool.compatibility.works_with.map((tech, j) => (
                                                <Badge key={j} variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                    <Check className="h-3 w-3 mr-1" /> {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
