"use client";
import { useState } from "react";
import { X, Sparkles, Send, Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import {
  addConsultingDeal,
  addSpeakingDeal,
  addDigitalLead,
  CONSULTING_STAGES,
  CONSULTING_SERVICES,
  CONSULTING_SOURCES,
  SPEAKING_STAGES,
  DIGITAL_STAGES,
} from "@/lib/store";

type ParsedLead = {
  pipeline: "consulting" | "speaking" | "digital";
  confidence: "high" | "medium" | "low";
  fields: Record<string, string | number | boolean | null>;
  summary: string;
};

type ModalState = "input" | "parsing" | "preview" | "saving" | "success" | "error";

const FIELD_LABELS: Record<string, string> = {
  company: "Company",
  contact: "Contact",
  value: "Deal Value ($)",
  service: "Service Type",
  probability: "Close Probability (%)",
  closeDate: "Expected Close Date",
  source: "Source",
  clientType: "Client Type",
  stage: "Stage",
  event: "Event Name",
  location: "Location",
  date: "Date",
  audienceSize: "Audience Size",
  revenue: "Revenue ($)",
  strategicValue: "Strategic Value",
  leadCapture: "Lead Capture",
  name: "Name",
  email: "Email",
  funnelStage: "Funnel Stage",
};

const FIELD_OPTIONS: Record<string, string[]> = {
  service: CONSULTING_SERVICES,
  stage: CONSULTING_STAGES,
  source: CONSULTING_SOURCES,
  clientType: ["Agency", "Brand-side"],
  strategicValue: ["High", "Medium", "Low"],
  leadCapture: ["true", "false"],
  funnelStage: DIGITAL_STAGES,
  speakingStage: SPEAKING_STAGES,
};

const PIPELINE_FIELDS: Record<string, string[]> = {
  consulting: ["company", "contact", "value", "service", "probability", "closeDate", "source", "clientType", "stage"],
  speaking: ["event", "location", "date", "audienceSize", "revenue", "strategicValue", "leadCapture", "stage"],
  digital: ["name", "email", "funnelStage", "source"],
};

const CONFIDENCE_COLORS = {
  high: "text-green-600 bg-green-50",
  medium: "text-yellow-600 bg-yellow-50",
  low: "text-red-600 bg-red-50",
};

export default function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<ModalState>("input");
  const [parsed, setParsed] = useState<ParsedLead | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");

  async function handleParse() {
    if (!input.trim()) return;
    setState("parsing");

    try {
      const res = await fetch("/api/parse-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to parse lead");
      }

      const data: ParsedLead = await res.json();
      setParsed(data);

      // Pre-fill editable fields
      const pipelineFields = PIPELINE_FIELDS[data.pipeline] || [];
      const editable: Record<string, string> = {};
      for (const key of pipelineFields) {
        const val = data.fields[key];
        if (val !== null && val !== undefined) {
          editable[key] = String(val);
        } else {
          editable[key] = "";
        }
      }
      setFields(editable);
      setState("preview");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  async function handleSave() {
    if (!parsed) return;
    setState("saving");

    try {
      if (parsed.pipeline === "consulting") {
        addConsultingDeal({
          company: fields.company || "",
          contact: fields.contact || "",
          value: parseFloat(fields.value) || 0,
          service: fields.service || "Advisory",
          probability: parseFloat(fields.probability) || 50,
          closeDate: fields.closeDate || "",
          source: fields.source || "Direct",
          clientType: fields.clientType || "Brand-side",
          stage: fields.stage || "Lead Identified",
        });
      } else if (parsed.pipeline === "speaking") {
        addSpeakingDeal({
          event: fields.event || "",
          location: fields.location || "",
          date: fields.date || "",
          audienceSize: parseInt(fields.audienceSize) || 0,
          revenue: parseFloat(fields.revenue) || 0,
          strategicValue: fields.strategicValue || "Medium",
          leadCapture: fields.leadCapture === "true",
          stage: fields.stage || "Inquiry",
        });
      } else if (parsed.pipeline === "digital") {
        addDigitalLead({
          name: fields.name || "",
          email: fields.email || "",
          funnelStage: fields.funnelStage || "Lead Magnet",
          source: fields.source || "Direct",
          revenue: 0,
        });
      }
      setState("success");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1200);
    } catch {
      setErrorMsg("Failed to save lead");
      setState("error");
    }
  }

  function handleReset() {
    setState("input");
    setInput("");
    setParsed(null);
    setFields({});
    setErrorMsg("");
  }

  const pipelineColor: Record<string, string> = {
    consulting: "text-blue-600",
    speaking: "text-green-600",
    digital: "text-purple-600",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold">Add Lead</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Input State */}
          {(state === "input" || state === "parsing") && (
            <div className="p-5">
              <p className="text-gray-500 text-sm mb-4">
                Describe your lead in natural language — AI will parse it into the correct pipeline and fields.
              </p>

              {/* Available Fields reference */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm space-y-1.5">
                <div className="font-semibold text-gray-700 mb-2">Available Fields</div>
                <p>
                  <span className="text-blue-600 font-semibold">Consulting:</span>{" "}
                  <span className="text-gray-600">Company, Contact, Deal Value, Service (Workshop/Retainer/Audit/Advisory), Probability, Close Date, Client Type, Source, Stage</span>
                </p>
                <p>
                  <span className="text-green-600 font-semibold">Speaking:</span>{" "}
                  <span className="text-gray-600">Event Name, Location, Date, Audience Size, Revenue, Strategic Value, Lead Capture, Stage</span>
                </p>
                <p>
                  <span className="text-purple-600 font-semibold">Digital:</span>{" "}
                  <span className="text-gray-600">Name, Email, Funnel Stage, Source</span>
                </p>
              </div>

              <div className="text-center text-xs text-gray-400 italic mb-4">
                e.g. "Workshop lead, Emory University, referral from AAU Conference, 50% probability, close 3/30/2026, stage: Scope Defined"
              </div>

              {/* Textarea input */}
              <div className="relative">
                <textarea
                  placeholder="Describe the lead..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                  disabled={state === "parsing"}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && input.trim()) {
                      handleParse();
                    }
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">Cmd+Enter to submit</div>
            </div>
          )}

          {/* Preview State */}
          {state === "preview" && parsed && (
            <div className="p-5">
              {/* Summary bar */}
              <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3 mb-4">
                <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{parsed.summary}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${pipelineColor[parsed.pipeline]} bg-white border`}>
                      {parsed.pipeline}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONFIDENCE_COLORS[parsed.confidence]}`}>
                      {parsed.confidence} confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div className="space-y-3">
                {(PIPELINE_FIELDS[parsed.pipeline] || []).map((key) => {
                  const options = FIELD_OPTIONS[key] || (key === "stage" && parsed.pipeline === "speaking" ? SPEAKING_STAGES : null);
                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        {FIELD_LABELS[key] || key}
                      </label>
                      {options ? (
                        <select
                          value={fields[key] || ""}
                          onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        >
                          <option value="">— Select —</option>
                          {options.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={key === "value" || key === "revenue" || key === "probability" || key === "audienceSize" ? "number" : "text"}
                          value={fields[key] || ""}
                          onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                          placeholder={`Enter ${FIELD_LABELS[key] || key}...`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success State */}
          {state === "success" && (
            <div className="p-10 flex flex-col items-center justify-center gap-3">
              <CheckCircle size={48} className="text-green-500" />
              <div className="text-lg font-semibold text-gray-900">Lead saved!</div>
              <div className="text-sm text-gray-500">Refreshing page...</div>
            </div>
          )}

          {/* Error State */}
          {state === "error" && (
            <div className="p-8 flex flex-col items-center justify-center gap-4">
              <AlertCircle size={40} className="text-red-500" />
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">Something went wrong</div>
                <div className="text-sm text-gray-500">{errorMsg}</div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-3 border-t border-gray-100 flex-shrink-0">
          {(state === "input" || state === "parsing") && (
            <button
              onClick={handleParse}
              disabled={!input.trim() || state === "parsing"}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
            >
              {state === "parsing" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Parsing with AI...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Parse Lead
                </>
              )}
            </button>
          )}

          {state === "preview" && (
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                <RefreshCw size={14} /> Start over
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                <CheckCircle size={16} />
                Save Lead
              </button>
            </div>
          )}

          {state === "saving" && (
            <button disabled className="w-full flex items-center justify-center gap-2 bg-blue-600 opacity-70 text-white rounded-xl py-2.5 text-sm font-medium">
              <Loader2 size={16} className="animate-spin" /> Saving...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
