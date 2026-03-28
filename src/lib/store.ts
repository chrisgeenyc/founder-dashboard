// Types
export interface ConsultingDeal {
  id: string;
  company: string;
  contact: string;
  stage: string;
  value: number;
  service: string;
  probability: number;
  closeDate: string;
  source: string;
  clientType: string;
  createdAt: string;
}

export interface SpeakingDeal {
  id: string;
  event: string;
  location: string;
  date: string;
  audienceSize: number;
  revenue: number;
  strategicValue: string;
  leadCapture: boolean;
  stage: string;
  createdAt: string;
}

export interface DigitalLead {
  id: string;
  name: string;
  email: string;
  funnelStage: string;
  source: string;
  revenue: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  pipelines: string[];
}

// Consulting stages
export const CONSULTING_STAGES = [
  "Lead Identified",
  "Initial Contact",
  "Discovery Call",
  "Proposal Sent",
  "Scope Defined",
  "Negotiation",
  "Signed",
  "Delivered",
  "Lost",
];

export const CONSULTING_SERVICES = [
  "Workshop",
  "Retainer",
  "Audit",
  "Advisory",
];

export const CONSULTING_SOURCES = [
  "Speaking",
  "Referral",
  "Ragan",
  "Mixing Board",
  "LinkedIn",
  "Course",
  "Direct",
];

export const SPEAKING_STAGES = [
  "Inquiry",
  "Proposal Sent",
  "Confirmed",
  "Contract Signed",
  "Delivered",
  "Cancelled",
];

export const DIGITAL_STAGES = [
  "Lead Magnet",
  "Email Subscriber",
  "Course Enrolled",
  "Cohort Member",
  "Consulting Inquiry",
];

// LocalStorage helpers
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// CRUD operations
export function getConsultingDeals(): ConsultingDeal[] {
  return getItem("consultingDeals", []);
}
export function setConsultingDeals(deals: ConsultingDeal[]) {
  setItem("consultingDeals", deals);
}
export function addConsultingDeal(deal: Omit<ConsultingDeal, "id" | "createdAt">) {
  const deals = getConsultingDeals();
  deals.push({ ...deal, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  setConsultingDeals(deals);
  return deals;
}

export function getSpeakingDeals(): SpeakingDeal[] {
  return getItem("speakingDeals", []);
}
export function setSpeakingDeals(deals: SpeakingDeal[]) {
  setItem("speakingDeals", deals);
}
export function addSpeakingDeal(deal: Omit<SpeakingDeal, "id" | "createdAt">) {
  const deals = getSpeakingDeals();
  deals.push({ ...deal, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  setSpeakingDeals(deals);
  return deals;
}

export function getDigitalLeads(): DigitalLead[] {
  return getItem("digitalLeads", []);
}
export function setDigitalLeads(leads: DigitalLead[]) {
  setItem("digitalLeads", leads);
}
export function addDigitalLead(lead: Omit<DigitalLead, "id" | "createdAt">) {
  const leads = getDigitalLeads();
  leads.push({ ...lead, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  setDigitalLeads(leads);
  return leads;
}

export function getContacts(): Contact[] {
  return getItem("contacts", []);
}
export function setContacts(contacts: Contact[]) {
  setItem("contacts", contacts);
}
export function upsertContact({
  name,
  email,
  company,
  pipeline,
}: {
  name: string;
  email?: string;
  company?: string;
  pipeline: string;
}) {
  if (!name.trim()) return;
  const contacts = getContacts();
  // Find existing by name (case-insensitive)
  const existing = contacts.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    if (!existing.pipelines.includes(pipeline)) {
      existing.pipelines.push(pipeline);
    }
    if (email && !existing.email) existing.email = email;
    if (company && !existing.company) existing.company = company;
    setContacts(contacts);
  } else {
    contacts.push({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email || "",
      company: company || "",
      pipelines: [pipeline],
    });
    setContacts(contacts);
  }
}

// Computed metrics
export function computeConsultingMetrics(deals: ConsultingDeal[]) {
  const active = deals.filter(d => !["Signed", "Delivered", "Lost"].includes(d.stage));
  const signed = deals.filter(d => ["Signed", "Delivered"].includes(d.stage));
  const pipelineValue = active.reduce((s, d) => s + d.value, 0);
  const projectedRevenue = active.reduce((s, d) => s + d.value * (d.probability / 100), 0);
  const totalDeals = deals.filter(d => d.stage !== "Lost").length;
  const conversionRate = totalDeals > 0 ? (signed.length / totalDeals) * 100 : 0;
  const avgDealSize = signed.length > 0 ? signed.reduce((s, d) => s + d.value, 0) / signed.length : 0;
  return { pipelineValue, projectedRevenue, activeDeals: active.length, conversionRate, avgDealSize, signed };
}

export function computeSpeakingMetrics(deals: SpeakingDeal[]) {
  const delivered = deals.filter(d => d.stage === "Delivered");
  const confirmed = deals.filter(d => ["Confirmed", "Contract Signed"].includes(d.stage));
  const revenueYTD = delivered.reduce((s, d) => s + d.revenue, 0);
  const confirmedRevenue = confirmed.reduce((s, d) => s + d.revenue, 0);
  const totalExposure = deals.reduce((s, d) => s + d.audienceSize, 0);
  return { revenueYTD, confirmedRevenue, totalExposure };
}

export function computeDigitalMetrics(leads: DigitalLead[]) {
  const revenueYTD = leads.reduce((s, l) => s + l.revenue, 0);
  const total = leads.length;
  const consultingInquiries = leads.filter(l => l.funnelStage === "Consulting Inquiry").length;
  const conversion = total > 0 ? (consultingInquiries / total) * 100 : 0;
  const topOfFunnel = leads.filter(l => l.funnelStage === "Lead Magnet").length;
  return { revenueYTD, conversion, topOfFunnel, total };
}

export function uid() {
  return crypto.randomUUID();
}
