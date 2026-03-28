"use client";
import { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { Contact, getContacts } from "@/lib/store";

const columns: Column<Contact>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "company", label: "Company" },
  {
    key: "pipelines",
    label: "Pipeline",
    render: (c) => (
      <div className="flex gap-1 flex-wrap">
        {c.pipelines.map((p) => (
          <span
            key={p}
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
              p === "Consulting"
                ? "bg-blue-50 text-blue-700"
                : p === "Speaking"
                ? "bg-green-50 text-green-700"
                : "bg-purple-50 text-purple-700"
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    ),
  },
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const filtered = search
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Contacts</h1>
      <p className="text-gray-500 text-sm mb-6">
        {contacts.length} contacts across pipelines
      </p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 w-full max-w-sm bg-white"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No contacts yet. Add leads to see them here."
      />
    </div>
  );
}
