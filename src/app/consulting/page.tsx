"use client";
import { useEffect, useState } from "react";
import {
  DollarSign,
  BarChart3,
  Clock,
  TrendingUp,
  Upload,
  Download,
} from "lucide-react";
import KpiCard from "@/components/KpiCard";
import DataTable, { Column } from "@/components/DataTable";
import {
  ConsultingDeal,
  getConsultingDeals,
  computeConsultingMetrics,
  CONSULTING_SERVICES,
  CONSULTING_SOURCES,
  CONSULTING_STAGES,
} from "@/lib/store";

type View = "table" | "kanban" | "forecast";

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

const columns: Column<ConsultingDeal>[] = [
  { key: "company", label: "Company" },
  { key: "contact", label: "Contact" },
  {
    key: "stage",
    label: "Stage",
    render: (d) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
        {d.stage}
      </span>
    ),
  },
  { key: "value", label: "Value", render: (d) => fmt(d.value) },
  { key: "service", label: "Service" },
  { key: "probability", label: "Probability", render: (d) => `${d.probability}%` },
  { key: "closeDate", label: "Close Date" },
  { key: "source", label: "Source" },
];

export default function ConsultingPipeline() {
  const [deals, setDeals] = useState<ConsultingDeal[]>([]);
  const [view, setView] = useState<View>("table");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    setDeals(getConsultingDeals());
  }, []);

  const metrics = computeConsultingMetrics(deals);

  const filtered = deals.filter((d) => {
    if (serviceFilter !== "all" && d.service !== serviceFilter) return false;
    if (sourceFilter !== "all" && d.source !== sourceFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consulting Pipeline</h1>
          <p className="text-gray-500 text-sm">
            {deals.length} deals · {fmt(metrics.projectedRevenue)} projected
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Pipeline Value"
          value={fmt(metrics.pipelineValue)}
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          label="Projected Revenue"
          value={fmt(metrics.projectedRevenue)}
          subtitle="Weighted by probability"
          icon={<BarChart3 size={18} />}
        />
        <KpiCard
          label="Active Deals"
          value={String(metrics.activeDeals)}
          icon={<Clock size={18} />}
        />
        <KpiCard
          label="Conversion Rate"
          value={pct(metrics.conversionRate)}
          subtitle="Signed / Total"
          icon={<TrendingUp size={18} />}
        />
      </div>

      {/* View Toggle + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="all">All Services</option>
            {CONSULTING_SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="all">All Sources</option>
            {CONSULTING_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {(["table", "kanban", "forecast"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
                view === v
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {v === "table" ? "Table" : v === "kanban" ? "Kanban" : "Forecast"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {view === "table" && <DataTable columns={columns} data={filtered} />}

      {view === "kanban" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CONSULTING_STAGES.filter(s => !["Delivered", "Lost"].includes(s)).map((stage) => {
            const stageDeals = filtered.filter((d) => d.stage === stage);
            return (
              <div key={stage} className="bg-gray-100 rounded-xl p-3 min-h-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    {stage}
                  </span>
                  <span className="text-xs bg-white px-1.5 py-0.5 rounded text-gray-500">
                    {stageDeals.length}
                  </span>
                </div>
                {stageDeals.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-100"
                  >
                    <div className="font-medium text-sm">{d.company}</div>
                    <div className="text-xs text-gray-500">{d.contact}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {fmt(d.value)} · {d.probability}%
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-xs text-gray-400 text-center mt-8">
                    No deals
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "forecast" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold mb-4">90-Day Revenue Forecast</h3>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Add deals to see forecast projections.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered
                .filter((d) => !["Delivered", "Lost"].includes(d.stage))
                .sort((a, b) => b.value * b.probability - a.value * a.probability)
                .map((d) => (
                  <div key={d.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{d.company}</div>
                      <div className="text-xs text-gray-500">
                        {d.service} · {d.stage}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{fmt(d.value)}</div>
                      <div className="text-xs text-gray-500">
                        {fmt(d.value * (d.probability / 100))} weighted
                      </div>
                    </div>
                    <div className="w-24">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${d.probability}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-right mt-0.5">
                        {d.probability}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
