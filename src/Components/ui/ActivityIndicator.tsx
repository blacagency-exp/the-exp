import React from 'react';
import { Loader2 } from 'lucide-react';

interface ActivityIndicatorProps {
    message?: string;
    className?: string;
    size?: number;
    color?: string;
    showMessage?: boolean;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
    message = "Loading...",
    className = "py-20",
    size = 40,
    color = "#89D618",
    showMessage = true
}) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <Loader2
                className="animate-spin"
                size={size}
                style={{ color }}
            />
            {showMessage && message && (
                <p className="text-[18px] font-medium text-[#141E03] mt-4">{message}</p>
            )}
        </div>
    );
};
