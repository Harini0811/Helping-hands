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

const LABEL: Record<string, string> = {
  individual: "Individual donor",
  volunteer: "Volunteer",
  organization: "Organization",
};

export default function ProfilePage() {
  const router = useRouter();
  const [p, setP] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return router.push("/account");
      const { data: row } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .maybeSingle();
      setP(row as Profile | null);
      setLoading(false);
    });
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
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
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
          ← Back to home
        </Link>

        {loading ? (
          <p>Loading…</p>
        ) : !p ? (
          <p>No profile found for this account.</p>
        ) : (
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
            <button
              onClick={logout}
              style={{
                marginTop: 24,
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
        )}
      </div>
    </main>
  );
}