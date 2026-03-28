import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a lead data extraction assistant for Chris Gee Consulting.
Parse natural language descriptions of leads and extract structured data.

Return ONLY valid JSON matching this exact schema:
{
  "pipeline": "consulting" | "speaking" | "digital",
  "confidence": "high" | "medium" | "low",
  "fields": {
    // For consulting pipeline:
    "company": string | null,
    "contact": string | null,
    "value": number | null,
    "service": "Workshop" | "Retainer" | "Audit" | "Advisory" | null,
    "probability": number | null,  // 0-100
    "closeDate": string | null,    // YYYY-MM-DD format
    "source": "Speaking" | "Referral" | "Ragan" | "Mixing Board" | "LinkedIn" | "Course" | "Direct" | null,
    "clientType": "Agency" | "Brand-side" | null,
    "stage": "Lead Identified" | "Initial Contact" | "Discovery Call" | "Proposal Sent" | "Scope Defined" | "Negotiation" | "Signed" | "Delivered" | null,

    // For speaking pipeline:
    "event": string | null,
    "location": string | null,
    "date": string | null,         // YYYY-MM-DD format
    "audienceSize": number | null,
    "revenue": number | null,
    "strategicValue": "High" | "Medium" | "Low" | null,
    "leadCapture": boolean | null,

    // For digital pipeline:
    "name": string | null,
    "email": string | null,
    "funnelStage": "Lead Magnet" | "Email Subscriber" | "Course Enrolled" | "Cohort Member" | "Consulting Inquiry" | null
  },
  "summary": string  // A brief 1-sentence summary of what was extracted
}

Rules:
- Determine the pipeline type from context clues (speaking/workshop/event/conference → could be speaking or consulting)
- If it mentions a speaking event + consulting/workshop, use consulting pipeline with service="Workshop"
- For dollar amounts, extract the number only (e.g. "$5,000" → 5000)
- For probabilities/percentages, extract the number (e.g. "50%" → 50)
- Default stage to "Lead Identified" if not specified
- Set null for any field not mentioned
- Do not infer values not present in the input`;

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input?.trim()) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Parse this lead description:\n\n"${input}"`,
        },
      ],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // Strip markdown code fences if present
    const raw = text.text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("parse-lead error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Parse failed" },
      { status: 500 }
    );
  }
}
