"use client";
import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Percent,
  Clock,
  Mic2,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import KpiCard from "@/components/KpiCard";
import {
  getConsultingDeals,
  getSpeakingDeals,
  getDigitalLeads,
  computeConsultingMetrics,
  computeSpeakingMetrics,
  computeDigitalMetrics,
} from "@/lib/store";

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;

const pct = (n: number) => `${n.toFixed(1)}%`;

// Placeholder chart data (populated from real data when available)
const emptyMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
].map((m) => ({ month: m, Consulting: 0, Speaking: 0, Digital: 0 }));

export default function Dashboard() {
  const [consulting, setConsulting] = useState(computeConsultingMetrics([]));
  const [speaking, setSpeaking] = useState(computeSpeakingMetrics([]));
  const [digital, setDigital] = useState(computeDigitalMetrics([]));
  const [revenueYTD, setRevenueYTD] = useState(0);

  useEffect(() => {
    const cd = getConsultingDeals();
    const sd = getSpeakingDeals();
    const dl = getDigitalLeads();
    const cm = computeConsultingMetrics(cd);
    const sm = computeSpeakingMetrics(sd);
    const dm = computeDigitalMetrics(dl);
    setConsulting(cm);
    setSpeaking(sm);
    setDigital(dm);
    setRevenueYTD(
      cm.signed.reduce((s, d) => s + d.value, 0) + sm.revenueYTD + dm.revenueYTD
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">
        Your founder operating system — revenue, pipeline, and forecasts at a glance.
      </p>

      {/* Row 1: Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <KpiCard
          label="Revenue YTD"
          value={fmt(revenueYTD)}
          subtitle="+18% vs last year"
          subtitleColor="text-green-600"
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          label="Pipeline Value"
          value={fmt(consulting.pipelineValue)}
          icon={<TrendingUp size={18} />}
        />
        <KpiCard
          label="Projected Rev"
          value={fmt(consulting.projectedRevenue)}
          subtitle="Weighted by probability"
          icon={<BarChart3 size={18} />}
        />
        <KpiCard
          label="Conversion Rate"
          value={pct(consulting.conversionRate)}
          subtitle="Consulting pipeline"
        />
        <KpiCard
          label="Avg Deal Size"
          value={fmt(consulting.avgDealSize)}
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          label="Active Deals"
          value={String(consulting.activeDeals)}
          icon={<Clock size={18} />}
        />
      </div>

      {/* Row 2: Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard
          label="90-Day Forecast"
          value={fmt(consulting.projectedRevenue)}
          subtitle={`${consulting.activeDeals} deals in pipeline`}
          subtitleColor="text-green-600"
          icon={<TrendingUp size={18} />}
        />
        <KpiCard
          label="Speaking Revenue"
          value={fmt(speaking.revenueYTD)}
          subtitle={`${fmt(speaking.revenueYTD)} delivered YTD`}
          icon={<Mic2 size={18} />}
        />
        <KpiCard
          label="Digital Conversion"
          value={pct(digital.conversion)}
          subtitle={`${fmt(digital.revenueYTD)} total digital revenue`}
          icon={<Filter size={18} />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue by Channel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Monthly Revenue by Channel
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={emptyMonths}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Legend />
              <Line type="monotone" dataKey="Consulting" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Speaking" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Digital" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Projected Revenue by Service Type */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Projected Revenue by Service Type
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={[
                { name: "Workshop", value: 0 },
                { name: "Retainer", value: 0 },
                { name: "Audit", value: 0 },
                { name: "Advisory", value: 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => fmt(v)} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Digital Funnel Conversion Path */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">
          Digital Funnel Conversion Path
        </h3>
        <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
          Add digital leads to see funnel visualization
        </div>
      </div>
    </div>
  );
}
