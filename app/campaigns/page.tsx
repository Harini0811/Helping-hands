"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useLang, LangSelect, type Lang } from "../../lib/i18n";

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

type Copy = {
  back: string;
  start: string;
  title: string;
  sub: string;
  loading: string;
  none: string;
  goal: string;
  by: string;
  copy: string;
  copied: string;
  kinds: { all: string; food: string; disaster: string; health: string; other: string };
};

const T: Record<Lang, Copy> = {
  en: {
    back: "← Back to home",
    start: "Start a campaign (organizations) →",
    title: "Campaigns",
    sub: "Every campaign is run by a verified organization and approved by our team. Donations go directly to the organization. Helping Hands does not handle money.",
    loading: "Loading…",
    none: "No campaigns yet.",
    goal: "Goal",
    by: "by",
    copy: "Copy UPI ID",
    copied: "Copied ✔",
    kinds: { all: "All", food: "Food supply", disaster: "Disaster relief", health: "Health & disease", other: "Other" },
  },
  hi: {
    back: "← होम पर वापस",
    start: "अभियान शुरू करें (संस्थाओं के लिए) →",
    title: "अभियान",
    sub: "हर अभियान एक जाँची हुई संस्था चलाती है और हमारी टीम उसे मंज़ूर करती है। दान सीधे संस्था को जाता है। हेल्पिंग हैंड्स पैसे नहीं संभालता।",
    loading: "लोड हो रहा है…",
    none: "अभी कोई अभियान नहीं है।",
    goal: "लक्ष्य",
    by: "द्वारा",
    copy: "UPI ID कॉपी करें",
    copied: "कॉपी हो गया ✔",
    kinds: { all: "सभी", food: "भोजन आपूर्ति", disaster: "आपदा राहत", health: "स्वास्थ्य और बीमारी", other: "अन्य" },
  },
  ta: {
    back: "← முகப்புக்குத் திரும்பு",
    start: "பிரச்சாரம் தொடங்கு (அமைப்புகளுக்கு) →",
    title: "பிரச்சாரங்கள்",
    sub: "ஒவ்வொரு பிரச்சாரமும் சரிபார்க்கப்பட்ட அமைப்பால் நடத்தப்பட்டு எங்கள் குழுவால் அங்கீகரிக்கப்படுகிறது. நன்கொடை நேரடியாக அமைப்புக்குச் செல்லும். ஹெல்ப்பிங் ஹேண்ட்ஸ் பணத்தைக் கையாளாது.",
    loading: "ஏற்றுகிறது…",
    none: "இன்னும் பிரச்சாரங்கள் இல்லை.",
    goal: "இலக்கு",
    by: "வழங்குபவர்",
    copy: "UPI ஐடியை நகலெடு",
    copied: "நகலெடுக்கப்பட்டது ✔",
    kinds: { all: "அனைத்தும்", food: "உணவு வழங்கல்", disaster: "பேரிடர் நிவாரணம்", health: "சுகாதாரம் & நோய்", other: "மற்றவை" },
  },
  ml: {
    back: "← ഹോമിലേക്ക് മടങ്ങുക",
    start: "ക്യാമ്പെയ്ൻ തുടങ്ങുക (സംഘടനകൾക്ക്) →",
    title: "ക്യാമ്പെയ്‌നുകൾ",
    sub: "ഓരോ ക്യാമ്പെയ്‌നും നടത്തുന്നത് പരിശോധിച്ച സംഘടനയാണ്, ഞങ്ങളുടെ ടീം അംഗീകരിച്ചതുമാണ്. സംഭാവന നേരിട്ട് സംഘടനയ്ക്കാണ് പോകുന്നത്. ഹെൽപ്പിംഗ് ഹാൻഡ്സ് പണം കൈകാര്യം ചെയ്യുന്നില്ല.",
    loading: "ലോഡ് ചെയ്യുന്നു…",
    none: "ഇതുവരെ ക്യാമ്പെയ്‌നുകളില്ല.",
    goal: "ലക്ഷ്യം",
    by: "സംഘടന",
    copy: "UPI ഐഡി കോപ്പി ചെയ്യുക",
    copied: "കോപ്പി ചെയ്തു ✔",
    kinds: { all: "എല്ലാം", food: "ഭക്ഷണ വിതരണം", disaster: "ദുരന്ത സഹായം", health: "ആരോഗ്യം & രോഗം", other: "മറ്റുള്ളവ" },
  },
  te: {
    back: "← హోమ్‌కు తిరిగి వెళ్ళండి",
    start: "ప్రచారం ప్రారంభించండి (సంస్థలకు) →",
    title: "ప్రచారాలు",
    sub: "ప్రతి ప్రచారాన్ని ధృవీకరించిన సంస్థ నడుపుతుంది, మా బృందం ఆమోదిస్తుంది. విరాళాలు నేరుగా సంస్థకే వెళ్తాయి. హెల్పింగ్ హ్యాండ్స్ డబ్బును నిర్వహించదు.",
    loading: "లోడ్ అవుతోంది…",
    none: "ఇంకా ప్రచారాలు లేవు.",
    goal: "లక్ష్యం",
    by: "ద్వారా",
    copy: "UPI ఐడి కాపీ చేయండి",
    copied: "కాపీ అయింది ✔",
    kinds: { all: "అన్నీ", food: "ఆహార సరఫరా", disaster: "విపత్తు సహాయం", health: "ఆరోగ్యం & వ్యాధి", other: "ఇతరాలు" },
  },
};

const KEYS = ["", "food", "disaster", "health", "other"] as const;

export default function CampaignsPage() {
  const [lang, setLang] = useLang();
  const t = T[lang];
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

  const label = (k: string) =>
    k === "" ? t.kinds.all : t.kinds[k as keyof Copy["kinds"]] ?? k;
  const shown = rows.filter((r) => !kind || r.kind === kind);

  return (
    <main
      lang={lang}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f2ea 0%, #eaf2ef 50%, #e4eef5 100%)",
        color: "#34505a",
        fontFamily: "Georgia, 'Nirmala UI', 'Segoe UI', serif",
        padding: "24px 16px 60px",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            {t.back}
          </Link>
          <LangSelect lang={lang} setLang={setLang} />
        </div>

        <h1 style={{ fontWeight: 400, fontSize: 36, margin: "24px 0 6px" }}>{t.title}</h1>
        <p style={{ color: "#5f7b82", marginTop: 0, lineHeight: 1.7 }}>{t.sub}</p>
        <p>
          <Link href="/campaigns/new" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            {t.start}
          </Link>
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0" }}>
          {KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid #b9d3cc",
                background: kind === k ? "#6aa89a" : "rgba(255,255,255,0.7)",
                color: kind === k ? "white" : "#4a6a70",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {label(k)}
            </button>
          ))}
        </div>

        {loading && <p>{t.loading}</p>}
        {!loading && shown.length === 0 && <p style={{ color: "#7a9298" }}>{t.none}</p>}

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
              {label(c.kind)} · {c.city}
            </div>
            <h3 style={{ fontWeight: 500, fontSize: 21, margin: "6px 0" }}>{c.title}</h3>
            <div style={{ fontSize: 14, color: "#4f8a7c", marginBottom: 10 }}>
              ✔ {t.by} {c.profiles?.name}
            </div>
            <p style={{ margin: "0 0 12px", lineHeight: 1.7, color: "#5f7b82" }}>{c.description}</p>
            {c.goal_amount && (
              <div style={{ fontSize: 15 }}>
                {t.goal}: ₹{c.goal_amount.toLocaleString("en-IN")}
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
                  {copied === c.id ? t.copied : t.copy}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}