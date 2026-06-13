'use client';

import React from 'react';

interface FleetUtilizationRateProps {
    numerator: number;
    denominator: number;
    title?: string;
    utilizationLabel?: string;
}

const FleetUtilisationRate: React.FC<FleetUtilizationRateProps> = ({
    numerator,
    denominator,
    title = "Fleet Utilization Rate",
    utilizationLabel = "Utilization",
}) => {
    const percentage = denominator > 0 ? (numerator / denominator) * 100 : 0;
    const roundedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));

    const size = 200;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - roundedPercentage / 100);

    return (
        <div className="max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                {title}
            </h3>

            <div className="relative mx-auto my-4 flex w-fit items-center justify-center">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500 ease-in-out"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                        {roundedPercentage}%
                    </span>
                    <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {numerator} / {denominator}
                    </span>
                </div>
            </div>

            <div className="mt-2 text-center text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {utilizationLabel}
            </div>
        </div>
    );
};

export default FleetUtilisationRate;