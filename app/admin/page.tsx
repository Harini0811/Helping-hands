"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Req = {
  id: string;
  created_at: string;
  category: string;
  title: string;
  details: string;
  city: string;
  urgency: string;
  phone: string;
  status: string;
};

const FILTERS = ["submitted", "verified", "rejected"];

export default function AdminPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [rows, setRows] = useState<Req[]>([]);
  const [filter, setFilter] = useState("submitted");

  async function load() {
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as Req[]) || []);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSignedIn(true);
        load();
      }
      setChecking(false);
    });
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoginErr("Wrong email or password.");
      return;
    }
    setSignedIn(true);
    load();
  }

  async function logout() {
    await supabase.auth.signOut();
    setSignedIn(false);
    setRows([]);
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);
    if (error) {
      alert("Could not update. Please try again.");
      return;
    }
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  const page = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f7f2ea 0%, #eaf2ef 50%, #e4eef5 100%)",
    color: "#34505a",
    fontFamily: "Georgia, 'Segoe UI', serif",
    padding: "24px 16px 60px",
  };

  const input = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #c9ddd7",
    fontSize: 16,
    marginBottom: 14,
    boxSizing: "border-box" as const,
  };

  const btn = (bg: string, color = "white") => ({
    background: bg,
    color,
    border: "none",
    padding: "10px 20px",
    borderRadius: 999,
    fontSize: 15,
    cursor: "pointer",
  });

  if (checking) {
    return <main style={page}>Loading…</main>;
  }

  if (!signedIn) {
    return (
      <main style={page}>
        <form
          onSubmit={login}
          style={{ maxWidth: 380, margin: "80px auto 0", textAlign: "center" }}
        >
          <div style={{ fontSize: 40 }}>🤝</div>
          <h1 style={{ fontWeight: 400 }}>Admin login</h1>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />
          {loginErr && <p style={{ color: "#b45309" }}>{loginErr}</p>}
          <button type="submit" style={{ ...btn("#6aa89a"), width: "100%" }}>
            Log in
          </button>
          <p style={{ marginTop: 24 }}>
            <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
              ← Back to home
            </Link>
          </p>
        </form>
      </main>
    );
  }

  const shown = rows.filter((r) => r.status === filter);

  return (
    <main style={page}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <h1 style={{ fontWeight: 400, margin: 0 }}>🤝 Review requests</h1>
          <button onClick={logout} style={btn("rgba(255,255,255,0.8)", "#4f8a7c")}>
            Log out
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, margin: "20px 0", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...btn(filter === f ? "#6aa89a" : "rgba(255,255,255,0.7)", filter === f ? "white" : "#4a6a70"),
                textTransform: "capitalize",
              }}
            >
              {f} ({rows.filter((r) => r.status === f).length})
            </button>
          ))}
        </div>

        {shown.length === 0 && (
          <p style={{ color: "#7a9298" }}>No {filter} requests.</p>
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
              {r.category} · {r.urgency} ·{" "}
              {new Date(r.created_at).toLocaleString()}
            </div>
            <h3 style={{ fontWeight: 500, fontSize: 20, margin: "6px 0" }}>
              {r.title}
            </h3>
            <p style={{ margin: "0 0 10px", lineHeight: 1.6, color: "#5f7b82" }}>
              {r.details}
            </p>
            <div style={{ fontSize: 15 }}>
              📍 {r.city} &nbsp; 📞 {r.phone}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              {r.status !== "verified" && (
                <button onClick={() => setStatus(r.id, "verified")} style={btn("#6aa89a")}>
                  Verify
                </button>
              )}
              {r.status !== "rejected" && (
                <button onClick={() => setStatus(r.id, "rejected")} style={btn("#c98a6b")}>
                  Reject
                </button>
              )}
              {r.status !== "submitted" && (
                <button onClick={() => setStatus(r.id, "submitted")} style={btn("rgba(255,255,255,0.9)", "#4a6a70")}>
                  Move back to submitted
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}