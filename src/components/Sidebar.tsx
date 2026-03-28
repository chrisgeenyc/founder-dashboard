"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Mic2,
  Filter,
  Users,
  Settings,
  Plus,
  X,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/consulting", label: "Consulting Pipeline", icon: Building2 },
  { href: "/speaking", label: "Speaking Pipeline", icon: Mic2 },
  { href: "/digital", label: "Digital Funnel", icon: Filter },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  open,
  onClose,
  onAddLead,
}: {
  open: boolean;
  onClose: () => void;
  onAddLead: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-gray-900 text-white flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <span className="font-semibold text-lg">Chris Gee Consulting</span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gray-800 text-white font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Add Lead Button */}
        <div className="p-4">
          <button
            onClick={onAddLead}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>

        {/* User */}
        <div className="px-5 py-3 border-t border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
            CG
          </div>
          <div>
            <div className="text-sm font-medium">Chris Gee</div>
            <div className="text-xs text-gray-500">Founder</div>
          </div>
        </div>
      </aside>
    </>
  );
}
