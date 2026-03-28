import { ReactNode } from "react";

export default function KpiCard({
  label,
  value,
  subtitle,
  icon,
  subtitleColor,
}: {
  label: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  subtitleColor?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between shadow-sm">
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && (
          <div className={`text-xs mt-1 ${subtitleColor || "text-gray-500"}`}>
            {subtitle}
          </div>
        )}
      </div>
      {icon && (
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
      )}
    </div>
  );
}
