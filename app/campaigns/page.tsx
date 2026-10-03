"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Camp = {
  id: string;
  title: string;
  kind: string;
  description: string;
  city: string | null;
  goal_amount: number | null;
  upi_id: string | null;
  profiles: { name: string } | null;
};

const KINDS = [
  { v: "", l: "All" },
  { v: "food", l: "Food supply" },
  { v: "disaster", l: "Disaster relief" },
  { v: "health", l: "Health & disease" },
  { v: "other", l: "Other" },
];

export default function CampaignsPage() {
  const [rows, setRows] = useState<Camp[]>([]);
  const [kind, setKind] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    supabase
      .from("campaigns")
      .select("id, title, kind, description, city, goal_amount, upi_id, profiles(name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as unknown as Camp[]) || []);
        setLoading(false);
      });
  }, []);

  const shown = rows.filter((r) => !kind || r.kind === kind);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f2ea 0%, #eaf2ef 50%, #e4eef5 100%)",
        color: "#34505a",
        fontFamily: "Georgia, 'Segoe UI', serif",
        padding: "24px 16px 60px",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            ← Back to home
          </Link>
          <Link href="/campaigns/new" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            Start a campaign (organizations) →
          </Link>
        </div>

        <h1 style={{ fontWeight: 400, fontSize: 36, margin: "24px 0 6px" }}>Campaigns</h1>
        <p style={{ color: "#5f7b82", marginTop: 0 }}>
          Every campaign is run by a verified organization and approved by our team.
          Donations go directly to the organization. Helping Hands does not handle money.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0" }}>
          {KINDS.map((k) => (
            <button
              key={k.v}
              onClick={() => setKind(k.v)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid #b9d3cc",
                background: kind === k.v ? "#6aa89a" : "rgba(255,255,255,0.7)",
                color: kind === k.v ? "white" : "#4a6a70",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {k.l}
            </button>
          ))}
        </div>

        {loading && <p>Loading…</p>}
        {!loading && shown.length === 0 && (
          <p style={{ color: "#7a9298" }}>No campaigns yet.</p>
        )}

        {shown.map((c) => (
          <div
            key={c.id}
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1px solid #dbe8e4",
              borderRadius: 18,
              padding: 22,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 13, color: "#7a9298" }}>
              {KINDS.find((k) => k.v === c.kind)?.l} · {c.city}
            </div>
            <h3 style={{ fontWeight: 500, fontSize: 21, margin: "6px 0" }}>{c.title}</h3>
            <div style={{ fontSize: 14, color: "#4f8a7c", marginBottom: 10 }}>
              ✔ by {c.profiles?.name}
            </div>
            <p style={{ margin: "0 0 12px", lineHeight: 1.7, color: "#5f7b82" }}>
              {c.description}
            </p>
            {c.goal_amount && (
              <div style={{ fontSize: 15 }}>
                Goal: ₹{c.goal_amount.toLocaleString("en-IN")}
              </div>
            )}
            {c.upi_id && (
              <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ background: "#eef5f2", padding: "8px 14px", borderRadius: 10 }}>
                  UPI: {c.upi_id}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(c.upi_id!);
                    setCopied(c.id);
                  }}
                  style={{
                    background: "#6aa89a",
                    color: "white",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  {copied === c.id ? "Copied ✔" : "Copy UPI ID"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}