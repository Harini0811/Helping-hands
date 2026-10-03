"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Req = {
  id: string;
  created_at: string;
  category: string;
  title: string;
  details: string;
  city: string;
  urgency: string;
};

const CATS = [
  "Food",
  "Medical care",
  "Education",
  "Financial support",
  "Essential utilities (power, water)",
  "Emergency",
];

const select = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #c9ddd7",
  fontSize: 15,
  background: "rgba(255,255,255,0.85)",
  color: "#34505a",
  fontFamily: "inherit",
};

export default function BrowsePage() {
  const router = useRouter();
  const [rows, setRows] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [mine, setMine] = useState<string[]>([]);
  const [cat, setCat] = useState("");
  const [city, setCity] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      const { data: s } = await supabase.auth.getSession();
      const uid = s.session?.user.id ?? null;
      setUserId(uid);

      const { data } = await supabase
        .from("open_requests")
        .select("*")
        .order("created_at", { ascending: false });
      setRows((data as Req[]) || []);

      if (uid) {
        const { data: h } = await supabase
          .from("helps")
          .select("request_id")
          .eq("helper_id", uid);
        setMine((h || []).map((x) => x.request_id as string));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function offer(id: string) {
    setMsg("");
    if (!userId) {
      router.push("/account");
      return;
    }
    const { error } = await supabase
      .from("helps")
      .insert({ request_id: id, helper_id: userId });
    if (error) {
      setMsg(
        error.message.includes("duplicate")
          ? "You have already offered help on this request."
          : "Could not save your offer. Please make sure you have created a profile."
      );
      return;
    }
    setMine([...mine, id]);
    setMsg("Thank you! Our team will connect you with the person in need.");
    window.scrollTo(0, 0);
  }

  const cities = Array.from(new Set(rows.map((r) => r.city.trim()))).sort();
  const shown = rows.filter(
    (r) =>
      (!cat || r.category === cat) &&
      (!city || r.city.trim().toLowerCase() === city.toLowerCase())
  );

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
          <Link
            href={userId ? "/profile" : "/account"}
            style={{ color: "#4f8a7c", textDecoration: "none" }}
          >
            {userId ? "My profile" : "Sign up / Log in"}
          </Link>
        </div>

        <h1 style={{ fontWeight: 400, fontSize: 36, margin: "24px 0 6px" }}>
          People who need help
        </h1>
        <p style={{ color: "#5f7b82", marginTop: 0 }}>
          Every request here has been verified by our team.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "20px 0" }}>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={select}>
            <option value="">All categories</option>
            {CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)} style={select}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {msg && (
          <div
            style={{
              background: "#d7ece5",
              color: "#2f6a5d",
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            {msg}
          </div>
        )}

        {loading && <p>Loading…</p>}
        {!loading && shown.length === 0 && (
          <p style={{ color: "#7a9298" }}>No verified requests match right now.</p>
        )}

        {shown.map((r) => (
          <div
            key={r.id}
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1px solid #dbe8e4",
              borderRadius: 18,
              padding: 20,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 13, color: "#7a9298" }}>
              {r.category} · {r.urgency}
            </div>
            <h3 style={{ fontWeight: 500, fontSize: 20, margin: "6px 0" }}>{r.title}</h3>
            <p style={{ margin: "0 0 10px", lineHeight: 1.6, color: "#5f7b82" }}>
              {r.details}
            </p>
            <div style={{ fontSize: 15 }}>📍 {r.city}</div>
            <div style={{ marginTop: 14 }}>
              {mine.includes(r.id) ? (
                <span style={{ color: "#2f7d6d" }}>✔ You offered to help</span>
              ) : (
                <button
                  onClick={() => offer(r.id)}
                  style={{
                    background: "#6aa89a",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 999,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  I can help
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}