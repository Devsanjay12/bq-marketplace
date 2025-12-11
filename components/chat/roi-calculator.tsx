"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tool } from "@/types";

interface ROICalculatorProps {
    tool: Tool;
}

export function ROICalculator({ tool }: ROICalculatorProps) {
    const [hourlyRate, setHourlyRate] = useState(50);
    const [hoursSaved, setHoursSaved] = useState(tool.roi?.estimated_hours_saved || 5);
    const [toolCost, setToolCost] = useState(tool.roi?.cost_per_month || 0);

    const weeklySavings = hoursSaved * hourlyRate;
    const monthlySavings = weeklySavings * 4;
    const netMonthlyBenefit = monthlySavings - toolCost;
    const annualBenefit = netMonthlyBenefit * 12;

    // Calculate break-even days
    const breakEvenDays = toolCost > 0 ? Math.ceil((toolCost / (weeklySavings / 5))) : 0;

    return (
        <div className="space-y-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Your Hourly Rate ($)</Label>
                        <div className="flex items-center gap-4">
                            <Slider
                                value={[hourlyRate]}
                                onValueChange={(v) => setHourlyRate(v[0])}
                                max={200}
                                step={5}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-20 h-8 font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Hours Saved / Week</Label>
                        <div className="flex items-center gap-4">
                            <Slider
                                value={[hoursSaved]}
                                onValueChange={(v) => setHoursSaved(v[0])}
                                max={40}
                                step={1}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                value={hoursSaved}
                                onChange={(e) => setHoursSaved(Number(e.target.value))}
                                className="w-20 h-8 font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tool Cost / Month ($)</Label>
                        <div className="flex items-center gap-4">
                            <Slider
                                value={[toolCost]}
                                onValueChange={(v) => setToolCost(v[0])}
                                max={500}
                                step={5}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                value={toolCost}
                                onChange={(e) => setToolCost(Number(e.target.value))}
                                className="w-20 h-8 font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Card className="p-4 bg-background border-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <span className="text-6xl font-bold text-primary">$</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Annual ROI</p>
                            <p className="text-3xl font-display font-bold text-primary">
                                ${annualBenefit.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Net savings after ${toolCost}/mo cost
                            </p>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-background rounded-md border border-border">
                            <p className="text-xs text-muted-foreground">Monthly Net</p>
                            <p className="text-lg font-bold font-mono text-foreground">
                                ${netMonthlyBenefit.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-background rounded-md border border-border">
                            <p className="text-xs text-muted-foreground">Break-Even</p>
                            <p className="text-lg font-bold font-mono text-foreground">
                                {toolCost === 0 ? "Instant" : `${breakEvenDays} Days`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
