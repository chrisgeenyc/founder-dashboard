"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Chris Gee Consulting");
  const [founderName, setFounderName] = useState("Chris Gee");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your dashboard preferences.</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
        <h3 className="font-semibold mb-4">General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founder Name
            </label>
            <input
              type="text"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
