"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const TYPES = [
  { value: "individual", label: "Individual donor" },
  { value: "volunteer", label: "Volunteer" },
  { value: "organization", label: "Organization (NGO, old age home, orphanage)" },
];

const box = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #c9ddd7",
  fontSize: 16,
  marginBottom: 14,
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

export default function AccountPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setBusy(true);
    setMsg("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("Wrong email or password.");
      return router.push("/profile");
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      setBusy(false);
      return setMsg(error?.message || "Could not sign up.");
    }
    if (!data.session) {
      setBusy(false);
      return setMsg("Please confirm your email, then log in.");
    }
    const { error: pErr } = await supabase.from("profiles").insert({
      id: data.user.id,
      name: String(f.get("name")),
      type: String(f.get("type")),
      city: String(f.get("city")),
      about: String(f.get("about")),
    });
    setBusy(false);
    if (pErr) return setMsg("Account created, but the profile could not be saved.");
    router.push("/profile");
  }

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
      <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
          ← Back to home
        </Link>
        <h1 style={{ fontWeight: 400, marginTop: 24 }}>
          {mode === "signup" ? "Join Helping Hands" : "Welcome back"}
        </h1>

        {mode === "signup" && (
          <>
            <select name="type" required style={box} defaultValue="individual">
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <input name="name" required placeholder="Your name or organization name" style={box} />
            <input name="city" required placeholder="City or town" style={box} />
            <textarea name="about" rows={3} placeholder="A few words about you (optional)" style={box} />
          </>
        )}

        <input name="email" type="email" required placeholder="Email" style={box} />
        <input name="password" type="password" required minLength={6} placeholder="Password (6+ characters)" style={box} />

        {msg && <p style={{ color: "#b45309" }}>{msg}</p>}

        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            background: "#6aa89a",
            color: "white",
            border: "none",
            padding: 14,
            borderRadius: 999,
            fontSize: 17,
            cursor: "pointer",
            opacity: busy ? 0.6 : 1,
          }}
        >
          {mode === "signup" ? "Create account" : "Log in"}
        </button>

        <p style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setMsg("");
            }}
            style={{ background: "none", border: "none", color: "#4f8a7c", cursor: "pointer", fontSize: 15 }}
          >
            {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
        </p>
      </form>
    </main>
  );
}