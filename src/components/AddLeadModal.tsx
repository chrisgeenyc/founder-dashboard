"use client";
import { useState } from "react";
import { X, Sparkles, Send } from "lucide-react";

export default function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold">Add Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6">
          <p className="text-gray-500 text-sm mb-4">
            Describe your lead in natural language and AI will parse it.
          </p>

          {/* Available Fields */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
            <div className="font-semibold mb-2">Available Fields</div>
            <p className="mb-1">
              <span className="text-blue-600 font-semibold">Consulting:</span>{" "}
              Company, Contact, Deal Value, Service Type
              (Workshop/Retainer/Audit/Advisory), Close Probability, Expected
              Close Date, Client Type (Agency/Brand-side), Source
              (Speaking/Referral/Referral - Ragan/Referral - Mixing
              Board/LinkedIn/Course/Direct), Stage
            </p>
            <p className="mb-1">
              <span className="text-green-600 font-semibold">Speaking:</span>{" "}
              Event Name, Location, Date, Audience Size, Revenue, Strategic Value
              (High/Medium/Low), Lead Capture (Yes/No), Stage
            </p>
            <p>
              <span className="text-purple-600 font-semibold">Digital:</span>{" "}
              Name, Email, Funnel Stage, Source
            </p>
          </div>

          {/* Example */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500 mb-1">Try something like:</div>
            <div className="text-sm text-gray-400 italic">
              &quot;Speaking/Workshop lead, Emory University, referral source: AAU
              Conference 2026, close probability 50%, expected close 3/30/2026,
              stage: Scope Defined&quot;
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
            <input
              type="text"
              placeholder="Describe the lead..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 outline-none text-sm py-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  // For now just close — AI parsing would go here
                  onClose();
                }
              }}
            />
            <button
              onClick={() => {
                if (input.trim()) onClose();
              }}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
