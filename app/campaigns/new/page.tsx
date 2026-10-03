"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

export default function NewCampaign() {
  const router = useRouter();
  const [uid, setUid] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.push("/account");
      const id = data.session.user.id;
      setUid(id);
      const { data: p } = await supabase
        .from("profiles")
        .select("type, verified")
        .eq("id", id)
        .maybeSingle();
      setOk(!!p && p.type === "organization" && p.verified === true);
    }
    check();
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const goal = Number(f.get("goal"));
    const { error } = await supabase.from("campaigns").insert({
      organizer_id: uid,
      title: String(f.get("title")),
      kind: String(f.get("kind")),
      description: String(f.get("description")),
      city: String(f.get("city")),
      goal_amount: goal > 0 ? goal : null,
      upi_id: String(f.get("upi")),
    });
    if (error) return setMsg("Could not submit. Please try again.");
    setDone(true);
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
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <Link href="/campaigns" style={{ color: "#4f8a7c", textDecoration: "none" }}>
          ← Back to campaigns
        </Link>
        <h1 style={{ fontWeight: 400, marginTop: 24 }}>Start a campaign</h1>

        {ok === null && <p>Loading…</p>}
        {ok === false && (
          <p style={{ lineHeight: 1.7 }}>
            Only <b>verified organizations</b> can start campaigns. If you registered as an
            organization, please wait for our team to verify you.
          </p>
        )}
        {done && (
          <p style={{ lineHeight: 1.7 }}>
            Thank you. Your campaign was submitted. It will appear publicly once our team
            approves it.
          </p>
        )}
        {ok && !done && (
          <form onSubmit={onSubmit}>
            <input name="title" required placeholder="Campaign title" style={box} />
            <select name="kind" required style={box} defaultValue="food">
              <option value="food">Food supply</option>
              <option value="disaster">Disaster relief</option>
              <option value="health">Health & disease</option>
              <option value="other">Other</option>
            </select>
            <textarea name="description" required rows={5} placeholder="Tell people what the money will be used for" style={box} />
            <input name="city" required placeholder="City or area" style={box} />
            <input name="goal" type="number" min={0} placeholder="Goal amount in ₹ (optional)" style={box} />
            <input name="upi" required placeholder="Organization UPI ID (e.g. name@bank)" style={box} />
            {msg && <p style={{ color: "#b45309" }}>{msg}</p>}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#6aa89a",
                color: "white",
                border: "none",
                padding: 14,
                borderRadius: 999,
                fontSize: 17,
                cursor: "pointer",
              }}
            >
              Submit for approval
            </button>
          </form>
        )}
      </div>
    </main>
  );
}