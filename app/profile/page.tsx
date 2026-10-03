"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Profile = {
  name: string;
  type: string;
  city: string | null;
  about: string | null;
  verified: boolean;
};

type Help = {
  id: string;
  created_at: string;
  status: string;
  title: string;
  category: string;
  city: string;
};

const LABEL: Record<string, string> = {
  individual: "Individual donor",
  volunteer: "Volunteer",
  organization: "Organization",
};

export default function ProfilePage() {
  const router = useRouter();
  const [p, setP] = useState<Profile | null>(null);
  const [history, setHistory] = useState<Help[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.push("/account");
      const uid = data.session.user.id;

      const { data: row } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();
      setP(row as Profile | null);

      const { data: helps } = await supabase
        .from("public_helps")
        .select("id, created_at, status, title, category, city")
        .eq("helper_id", uid)
        .order("created_at", { ascending: false });
      setHistory((helps as Help[]) || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const delivered = history.filter((h) => h.status === "delivered").length;
  const pending = history.length - delivered;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f2ea 0%, #eaf2ef 50%, #e4eef5 100%)",
        color: "#34505a",
        fontFamily: "Georgia, 'Segoe UI', serif",
        padding: "30px 16px 60px",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            ← Back to home
          </Link>
          <Link href="/browse" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            Find people to help →
          </Link>
          <Link href="/campaigns" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            Campaigns →
          </Link>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : !p ? (
          <p>No profile found for this account.</p>
        ) : (
          <>
            <div
              style={{
                marginTop: 24,
                background: "rgba(255,255,255,0.75)",
                border: "1px solid #dbe8e4",
                borderRadius: 20,
                padding: 28,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48 }}>🤝</div>
              <h1 style={{ fontWeight: 400, margin: "8px 0" }}>{p.name}</h1>
              <div style={{ color: "#5f7b82" }}>
                {LABEL[p.type]} · {p.city}
              </div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "4px 14px",
                  borderRadius: 999,
                  fontSize: 14,
                  background: p.verified ? "#d7ece5" : "#f3ead9",
                  color: p.verified ? "#2f7d6d" : "#8a6a2f",
                }}
              >
                {p.verified ? "✔ Verified" : "Awaiting verification"}
              </div>
              {p.about && (
                <p style={{ lineHeight: 1.7, color: "#5f7b82", marginTop: 20 }}>{p.about}</p>
              )}

              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 40, color: "#4f8a7c" }}>{delivered}</div>
                <div style={{ color: "#7a9298", fontSize: 14 }}>
                  {delivered === 1 ? "person helped" : "people helped"}
                </div>
                {pending > 0 && (
                  <div style={{ color: "#8a6a2f", fontSize: 13, marginTop: 6 }}>
                    {pending} awaiting confirmation
                  </div>
                )}
              </div>
              {p.type === "organization" && p.verified && (
                <div style={{ marginTop: 22 }}>
                  <Link
                    href="/campaigns/new"
                    style={{
                      background: "#6aa89a",
                      color: "white",
                      padding: "12px 28px",
                      borderRadius: 999,
                      textDecoration: "none",
                      fontSize: 16,
                    }}
                  >
                    Start a campaign
                  </Link>
                </div>
              )}

              <button
                onClick={logout}
                style={{
                  marginTop: 22,
                  background: "rgba(255,255,255,0.9)",
                  color: "#4f8a7c",
                  border: "1px solid #b9d3cc",
                  padding: "10px 24px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                Log out
              </button>
            </div>

            <h2 style={{ fontWeight: 400, margin: "32px 0 14px" }}>Help history</h2>
            {history.length === 0 && (
              <p style={{ color: "#7a9298" }}>
                No help recorded yet. When you offer help on a request, it will appear here.
              </p>
            )}
            {history.map((h) => (
              <div
                key={h.id}
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid #dbe8e4",
                  borderRadius: 16,
                  padding: "16px 20px",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 13, color: "#7a9298" }}>
                  {h.category} · {new Date(h.created_at).toLocaleDateString()}
                </div>
                <div style={{ fontSize: 18, margin: "4px 0" }}>{h.title}</div>
                <div style={{ fontSize: 14, color: "#5f7b82" }}>📍 {h.city}</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: h.status === "delivered" ? "#2f7d6d" : "#8a6a2f",
                  }}
                >
                  {h.status === "delivered" ? "✔ Delivered" : "Awaiting confirmation"}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}