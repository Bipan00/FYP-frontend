import React from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
    return (
        <div className="mb-5">
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full shrink-0" />
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            {subtitle && (
                <p className="mt-1 text-sm text-gray-500 ml-4">{subtitle}</p>
            )}
        </div>
    );
};

export default SectionTitle;
