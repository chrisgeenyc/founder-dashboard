"use client";
import { useEffect, useState } from "react";
import { DollarSign, Mic2, Users, Upload, Download } from "lucide-react";
import KpiCard from "@/components/KpiCard";
import DataTable, { Column } from "@/components/DataTable";
import {
  SpeakingDeal,
  getSpeakingDeals,
  computeSpeakingMetrics,
  SPEAKING_STAGES,
} from "@/lib/store";

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;

const columns: Column<SpeakingDeal>[] = [
  { key: "event", label: "Event" },
  { key: "location", label: "Location" },
  { key: "date", label: "Date" },
  { key: "audienceSize", label: "Audience", render: (d) => d.audienceSize.toLocaleString() },
  { key: "revenue", label: "Revenue", render: (d) => fmt(d.revenue) },
  {
    key: "strategicValue",
    label: "Value",
    render: (d) => (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          d.strategicValue === "High"
            ? "bg-green-50 text-green-700"
            : d.strategicValue === "Medium"
            ? "bg-yellow-50 text-yellow-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {d.strategicValue}
      </span>
    ),
  },
  {
    key: "leadCapture",
    label: "Leads",
    render: (d) => (d.leadCapture ? "Yes" : "No"),
  },
  {
    key: "stage",
    label: "Stage",
    render: (d) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
        {d.stage}
      </span>
    ),
  },
];

export default function SpeakingPipeline() {
  const [deals, setDeals] = useState<SpeakingDeal[]>([]);
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    setDeals(getSpeakingDeals());
  }, []);

  const metrics = computeSpeakingMetrics(deals);
  const filtered =
    stageFilter === "all" ? deals : deals.filter((d) => d.stage === stageFilter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Speaking Pipeline</h1>
          <p className="text-gray-500 text-sm">
            {deals.length} engagements tracked
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            <Upload size={14} /> Import
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard
          label="Speaking Revenue YTD"
          value={fmt(metrics.revenueYTD)}
          subtitle="From delivered events"
          subtitleColor="text-green-600"
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          label="Confirmed Revenue"
          value={fmt(metrics.confirmedRevenue)}
          subtitle="Upcoming confirmed"
          icon={<Mic2 size={18} />}
        />
        <KpiCard
          label="Total Projected Exposure"
          value={metrics.totalExposure.toLocaleString()}
          subtitle="Total audience reach"
          icon={<Users size={18} />}
        />
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="all">All Stages</option>
          {SPEAKING_STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
