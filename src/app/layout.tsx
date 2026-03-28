"use client";
import "./globals.css";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AddLeadModal from "@/components/AddLeadModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddLead, setShowAddLead] = useState(false);

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddLead={() => setShowAddLead(true)}
        />

        {/* Main content */}
        <main className="lg:ml-[260px] min-h-screen transition-all duration-200">
          <div className="p-6 lg:p-8 max-w-[1400px]">{children}</div>
        </main>

        {/* Mobile menu toggle */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 lg:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          </button>
        )}

        {/* Add Lead Modal */}
        {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} />}
      </body>
    </html>
  );
}
