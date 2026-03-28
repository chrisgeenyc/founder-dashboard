"use client";
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Clock, Filter, Upload, Download } from "lucide-react";
import KpiCard from "@/components/KpiCard";
import {
  DigitalLead,
  getDigitalLeads,
  computeDigitalMetrics,
  DIGITAL_STAGES,
} from "@/lib/store";

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

export default function DigitalFunnel() {
  const [leads, setLeads] = useState<DigitalLead[]>([]);

  useEffect(() => {
    setLeads(getDigitalLeads());
  }, []);

  const metrics = computeDigitalMetrics(leads);

  // Stage breakdown
  const stageData = DIGITAL_STAGES.map((stage) => {
    const stageLeads = leads.filter((l) => l.funnelStage === stage);
    const count = stageLeads.length;
    const revenue = stageLeads.reduce((s, l) => s + l.revenue, 0);
    return { stage, count, revenue };
  });

  const totalLeads = leads.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Funnel</h1>
          <p className="text-gray-500 text-sm">
            Lead magnets → courses → cohorts → consulting conversions
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
          label="Digital Revenue YTD"
          value={fmt(metrics.revenueYTD)}
          subtitle="All digital products"
          subtitleColor="text-green-600"
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          label="Overall Conversion"
          value={pct(metrics.conversion)}
          subtitle="Lead to consulting"
          icon={<TrendingUp size={18} />}
        />
        <KpiCard
          label="Avg Step Duration"
          value="0 days"
          subtitle="Between funnel stages"
          icon={<Clock size={18} />}
        />
        <KpiCard
          label="Top of Funnel"
          value={String(metrics.topOfFunnel)}
          subtitle="Lead magnet signups"
          icon={<Filter size={18} />}
        />
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        {totalLeads === 0 ? (
          <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
            Add digital leads to see funnel visualization
          </div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {stageData.map((s, i) => {
              const height = totalLeads > 0 ? Math.max((s.count / totalLeads) * 100, 5) : 5;
              return (
                <div key={s.stage} className="flex-1 flex flex-col items-center">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    {s.count}
                  </div>
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${height}%`,
                      backgroundColor: `hsl(${220 - i * 30}, 70%, 55%)`,
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {s.stage}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stage Details Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4">
          <h3 className="font-semibold text-gray-900">Stage Details</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Stage
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Count
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Conversion %
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Revenue
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Rev/Person
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Avg Days to Next
              </th>
            </tr>
          </thead>
          <tbody>
            {stageData.map((s) => (
              <tr
                key={s.stage}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="px-5 py-3 text-gray-700">{s.stage}</td>
                <td className="px-5 py-3 text-gray-700">{s.count}</td>
                <td className="px-5 py-3 text-gray-700">
                  {totalLeads > 0 ? pct((s.count / totalLeads) * 100) : "0.0%"}
                </td>
                <td className="px-5 py-3 text-gray-700">{fmt(s.revenue)}</td>
                <td className="px-5 py-3 text-gray-700">
                  {s.count > 0 ? fmt(s.revenue / s.count) : "$0"}
                </td>
                <td className="px-5 py-3 text-gray-700">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
