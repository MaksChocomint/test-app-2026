import React from "react";

interface InfoCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const InfoCard = React.memo(
  ({ title, description, children }: InfoCardProps) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && <p className="text-gray-500 mt-2">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  },
);

InfoCard.displayName = "InfoCard";
