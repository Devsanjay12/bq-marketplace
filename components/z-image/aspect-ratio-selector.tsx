'use client';

import { cn } from '@/lib/utils';

const ASPECT_RATIOS = [
    { value: '1:1', label: '1:1', icon: '⬜' },
    { value: '4:3', label: '4:3', icon: '▭' },
    { value: '3:4', label: '3:4', icon: '▯' },
    { value: '16:9', label: '16:9', icon: '▬' },
    { value: '9:16', label: '9:16', icon: '▮' },
];

interface AspectRatioSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function AspectRatioSelector({
    value,
    onChange,
    disabled,
}: AspectRatioSelectorProps) {
    return (
        <div className="grid grid-cols-5 gap-2 mt-2">
            {ASPECT_RATIOS.map((ratio) => (
                <button
                    key={ratio.value}
                    type="button"
                    onClick={() => onChange(ratio.value)}
                    disabled={disabled}
                    className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                        value === ratio.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <span className="text-2xl mb-1">{ratio.icon}</span>
                    <span className="text-xs font-medium">{ratio.label}</span>
                </button>
            ))}
        </div>
    );
}
