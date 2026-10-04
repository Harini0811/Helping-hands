"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useLang, LangSelect, type Lang } from "../../lib/i18n";

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

const CATS_EN = [
  "Food",
  "Medical care",
  "Education",
  "Financial support",
  "Essential utilities (power, water)",
  "Emergency",
];

type Copy = {
  back: string;
  browse: string;
  campaigns: string;
  loading: string;
  noProfile: string;
  individual: string;
  volunteer: string;
  organization: string;
  verified: string;
  awaiting: string;
  one: string;
  many: string;
  pendingTail: string;
  start: string;
  logout: string;
  history: string;
  noHistory: string;
  delivered: string;
  awaitingConf: string;
  cats: string[];
};

const T: Record<Lang, Copy> = {
  en: {
    back: "← Back to home",
    browse: "Find people to help →",
    campaigns: "Campaigns →",
    loading: "Loading…",
    noProfile: "No profile found for this account.",
    individual: "Individual donor",
    volunteer: "Volunteer",
    organization: "Organization",
    verified: "✔ Verified",
    awaiting: "Awaiting verification",
    one: "person helped",
    many: "people helped",
    pendingTail: "awaiting confirmation",
    start: "Start a campaign",
    logout: "Log out",
    history: "Help history",
    noHistory: "No help recorded yet. When you offer help on a request, it will appear here.",
    delivered: "✔ Delivered",
    awaitingConf: "Awaiting confirmation",
    cats: ["Food", "Medical care", "Education", "Financial support", "Essential utilities (power, water)", "Emergency"],
  },
  hi: {
    back: "← होम पर वापस",
    browse: "मदद करने के लिए लोग खोजें →",
    campaigns: "अभियान →",
    loading: "लोड हो रहा है…",
    noProfile: "इस खाते की कोई प्रोफ़ाइल नहीं मिली।",
    individual: "व्यक्तिगत दानदाता",
    volunteer: "स्वयंसेवक",
    organization: "संस्था",
    verified: "✔ जाँचा हुआ",
    awaiting: "जाँच की प्रतीक्षा में",
    one: "व्यक्ति की मदद की",
    many: "लोगों की मदद की",
    pendingTail: "पुष्टि की प्रतीक्षा में",
    start: "अभियान शुरू करें",
    logout: "लॉग आउट",
    history: "मदद का इतिहास",
    noHistory: "अभी कोई मदद दर्ज नहीं है। जब आप किसी अनुरोध पर मदद की पेशकश करेंगे, वह यहाँ दिखेगी।",
    delivered: "✔ पहुँचाई गई",
    awaitingConf: "पुष्टि की प्रतीक्षा में",
    cats: ["भोजन", "चिकित्सा", "शिक्षा", "आर्थिक सहायता", "ज़रूरी सुविधाएँ (बिजली, पानी)", "आपातकाल"],
  },
  ta: {
    back: "← முகப்புக்குத் திரும்பு",
    browse: "உதவ வேண்டியவர்களைத் தேடு →",
    campaigns: "பிரச்சாரங்கள் →",
    loading: "ஏற்றுகிறது…",
    noProfile: "இந்தக் கணக்கிற்கு சுயவிவரம் இல்லை.",
    individual: "தனிநபர் நன்கொடையாளர்",
    volunteer: "தன்னார்வலர்",
    organization: "அமைப்பு",
    verified: "✔ சரிபார்க்கப்பட்டது",
    awaiting: "சரிபார்ப்புக்காகக் காத்திருக்கிறது",
    one: "நபருக்கு உதவப்பட்டது",
    many: "நபர்களுக்கு உதவப்பட்டது",
    pendingTail: "உறுதிப்படுத்தலுக்காகக் காத்திருக்கிறது",
    start: "பிரச்சாரம் தொடங்கு",
    logout: "வெளியேறு",
    history: "உதவி வரலாறு",
    noHistory: "இன்னும் உதவி பதிவாகவில்லை. ஒரு கோரிக்கைக்கு உதவ முன்வந்தால் அது இங்கே தெரியும்.",
    delivered: "✔ சென்றடைந்தது",
    awaitingConf: "உறுதிப்படுத்தலுக்காகக் காத்திருக்கிறது",
    cats: ["உணவு", "மருத்துவ உதவி", "கல்வி", "நிதி உதவி", "அத்தியாவசிய சேவைகள் (மின்சாரம், தண்ணீர்)", "அவசர நிலை"],
  },
  ml: {
    back: "← ഹോമിലേക്ക് മടങ്ങുക",
    browse: "സഹായിക്കാൻ ആളുകളെ കണ്ടെത്തൂ →",
    campaigns: "ക്യാമ്പെയ്‌നുകൾ →",
    loading: "ലോഡ് ചെയ്യുന്നു…",
    noProfile: "ഈ അക്കൗണ്ടിന് പ്രൊഫൈൽ കണ്ടെത്തിയില്ല.",
    individual: "വ്യക്തിഗത ദാതാവ്",
    volunteer: "സന്നദ്ധപ്രവർത്തകൻ",
    organization: "സംഘടന",
    verified: "✔ പരിശോധിച്ചത്",
    awaiting: "പരിശോധനയ്ക്കായി കാത്തിരിക്കുന്നു",
    one: "വ്യക്തിയെ സഹായിച്ചു",
    many: "പേരെ സഹായിച്ചു",
    pendingTail: "സ്ഥിരീകരണത്തിനായി കാത്തിരിക്കുന്നു",
    start: "ക്യാമ്പെയ്ൻ തുടങ്ങുക",
    logout: "ലോഗ് ഔട്ട്",
    history: "സഹായ ചരിത്രം",
    noHistory: "ഇതുവരെ സഹായം രേഖപ്പെടുത്തിയിട്ടില്ല. ഒരു അഭ്യർത്ഥനയിൽ സഹായം വാഗ്ദാനം ചെയ്താൽ അത് ഇവിടെ കാണാം.",
    delivered: "✔ എത്തിച്ചു",
    awaitingConf: "സ്ഥിരീകരണത്തിനായി കാത്തിരിക്കുന്നു",
    cats: ["ഭക്ഷണം", "ചികിത്സ", "വിദ്യാഭ്യാസം", "സാമ്പത്തിക സഹായം", "അവശ്യ സേവനങ്ങൾ (വൈദ്യുതി, വെള്ളം)", "അടിയന്തരാവസ്ഥ"],
  },
  te: {
    back: "← హోమ్‌కు తిరిగి వెళ్ళండి",
    browse: "సహాయం చేయాల్సిన వారిని చూడండి →",
    campaigns: "ప్రచారాలు →",
    loading: "లోడ్ అవుతోంది…",
    noProfile: "ఈ ఖాతాకు ప్రొఫైల్ కనబడలేదు.",
    individual: "వ్యక్తిగత దాత",
    volunteer: "వాలంటీర్",
    organization: "సంస్థ",
    verified: "✔ ధృవీకరించబడింది",
    awaiting: "ధృవీకరణ కోసం ఎదురుచూస్తోంది",
    one: "మందికి సహాయం చేశారు",
    many: "మందికి సహాయం చేశారు",
    pendingTail: "నిర్ధారణ కోసం ఎదురుచూస్తున్నాయి",
    start: "ప్రచారం ప్రారంభించండి",
    logout: "లాగ్ అవుట్",
    history: "సహాయ చరిత్ర",
    noHistory: "ఇంకా సహాయం నమోదు కాలేదు. మీరు ఏదైనా అభ్యర్థనకు సహాయం చేస్తామని చెప్పినప్పుడు అది ఇక్కడ కనిపిస్తుంది.",
    delivered: "✔ చేరింది",
    awaitingConf: "నిర్ధారణ కోసం ఎదురుచూస్తోంది",
    cats: ["ఆహారం", "వైద్య సహాయం", "విద్య", "ఆర్థిక సహాయం", "అవసరమైన సేవలు (విద్యుత్, నీరు)", "అత్యవసరం"],
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const [lang, setLang] = useLang();
  const t = T[lang];
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
  const typeLabel = (x: string) =>
    x === "organization" ? t.organization : x === "volunteer" ? t.volunteer : t.individual;
  const catLabel = (c: string) => {
    const i = CATS_EN.indexOf(c);
    return i >= 0 ? t.cats[i] : c;
  };

  return (
    <main
      lang={lang}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f2ea 0%, #eaf2ef 50%, #e4eef5 100%)",
        color: "#34505a",
        fontFamily: "Georgia, 'Nirmala UI', 'Segoe UI', serif",
        padding: "30px 16px 60px",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            {t.back}
          </Link>
          <LangSelect lang={lang} setLang={setLang} />
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 14 }}>
          <Link href="/browse" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            {t.browse}
          </Link>
          <Link href="/campaigns" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            {t.campaigns}
          </Link>
        </div>

        {loading ? (
          <p>{t.loading}</p>
        ) : !p ? (
          <p>{t.noProfile}</p>
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
                {typeLabel(p.type)} · {p.city}
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
                {p.verified ? t.verified : t.awaiting}
              </div>
              {p.about && (
                <p style={{ lineHeight: 1.7, color: "#5f7b82", marginTop: 20 }}>{p.about}</p>
              )}

              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 40, color: "#4f8a7c" }}>{delivered}</div>
                <div style={{ color: "#7a9298", fontSize: 14 }}>
                  {delivered === 1 ? t.one : t.many}
                </div>
                {pending > 0 && (
                  <div style={{ color: "#8a6a2f", fontSize: 13, marginTop: 6 }}>
                    {pending} {t.pendingTail}
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
                    {t.start}
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
                {t.logout}
              </button>
            </div>

            <h2 style={{ fontWeight: 400, margin: "32px 0 14px" }}>{t.history}</h2>
            {history.length === 0 && <p style={{ color: "#7a9298" }}>{t.noHistory}</p>}
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
                  {catLabel(h.category)} · {new Date(h.created_at).toLocaleDateString()}
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
                  {h.status === "delivered" ? t.delivered : t.awaitingConf}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}