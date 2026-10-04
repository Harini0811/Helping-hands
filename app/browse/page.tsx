"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useLang, LangSelect, type Lang } from "../../lib/i18n";

type Req = {
  id: string;
  created_at: string;
  category: string;
  title: string;
  details: string;
  city: string;
  urgency: string;
};

const CATS_EN = [
  "Food",
  "Medical care",
  "Education",
  "Financial support",
  "Essential utilities (power, water)",
  "Emergency",
];
const URGS_EN = ["Can wait a few days", "Within a day or two", "Very urgent"];

type Copy = {
  back: string;
  profile: string;
  join: string;
  title: string;
  sub: string;
  allCats: string;
  allCities: string;
  loading: string;
  none: string;
  help: string;
  offered: string;
  thanks: string;
  dup: string;
  err: string;
  best: string;
  bestSub: string;
  rCity: string;
  rPast: string;
  rUrg: string;
  all: string;
  hint: string;
  cats: string[];
  urgs: string[];
};

const T: Record<Lang, Copy> = {
  en: {
    back: "← Back to home",
    profile: "My profile",
    join: "Sign up / Log in",
    title: "People who need help",
    sub: "Every request here has been verified by our team.",
    allCats: "All categories",
    allCities: "All cities",
    loading: "Loading…",
    none: "No verified requests match right now.",
    help: "I can help",
    offered: "✔ You offered to help",
    thanks: "Thank you! Our team will connect you with the person in need.",
    dup: "You have already offered help on this request.",
    err: "Could not save your offer. Please make sure you have created a profile.",
    best: "Best matches for you",
    bestSub: "Based on your city, your past help and urgency.",
    rCity: "Same city",
    rPast: "Like help you gave before",
    rUrg: "Very urgent",
    all: "All requests",
    hint: "Log in to see matches picked for you.",
    cats: ["Food", "Medical care", "Education", "Financial support", "Essential utilities (power, water)", "Emergency"],
    urgs: ["Can wait a few days", "Within a day or two", "Very urgent"],
  },
  hi: {
    back: "← होम पर वापस",
    profile: "मेरी प्रोफ़ाइल",
    join: "साइन अप / लॉग इन",
    title: "जिन्हें मदद चाहिए",
    sub: "यहाँ हर अनुरोध की जाँच हमारी टीम ने की है।",
    allCats: "सभी श्रेणियाँ",
    allCities: "सभी शहर",
    loading: "लोड हो रहा है…",
    none: "अभी कोई जाँचा हुआ अनुरोध नहीं मिला।",
    help: "मैं मदद कर सकता/सकती हूँ",
    offered: "✔ आपने मदद की पेशकश की",
    thanks: "धन्यवाद! हमारी टीम आपको ज़रूरतमंद व्यक्ति से जोड़ेगी।",
    dup: "आप इस अनुरोध पर पहले ही मदद की पेशकश कर चुके हैं।",
    err: "आपकी पेशकश सहेजी नहीं जा सकी। कृपया जाँचें कि आपने प्रोफ़ाइल बनाई है।",
    best: "आपके लिए सबसे उपयुक्त",
    bestSub: "आपके शहर, पिछली मदद और ज़रूरत की तात्कालिकता के आधार पर।",
    rCity: "वही शहर",
    rPast: "आपकी पहले की मदद जैसा",
    rUrg: "बहुत ज़रूरी",
    all: "सभी अनुरोध",
    hint: "अपने लिए चुने गए अनुरोध देखने के लिए लॉग इन करें।",
    cats: ["भोजन", "चिकित्सा", "शिक्षा", "आर्थिक सहायता", "ज़रूरी सुविधाएँ (बिजली, पानी)", "आपातकाल"],
    urgs: ["कुछ दिन रुक सकता है", "एक-दो दिन में", "बहुत ज़रूरी"],
  },
  ta: {
    back: "← முகப்புக்குத் திரும்பு",
    profile: "என் சுயவிவரம்",
    join: "பதிவு / உள்நுழை",
    title: "உதவி தேவைப்படுபவர்கள்",
    sub: "இங்குள்ள ஒவ்வொரு கோரிக்கையும் எங்கள் குழுவால் சரிபார்க்கப்பட்டது.",
    allCats: "அனைத்து வகைகள்",
    allCities: "அனைத்து நகரங்கள்",
    loading: "ஏற்றுகிறது…",
    none: "இப்போது பொருந்தும் சரிபார்க்கப்பட்ட கோரிக்கைகள் இல்லை.",
    help: "நான் உதவ முடியும்",
    offered: "✔ நீங்கள் உதவ முன்வந்தீர்கள்",
    thanks: "நன்றி! உதவி தேவைப்படுபவருடன் எங்கள் குழு உங்களை இணைக்கும்.",
    dup: "இந்தக் கோரிக்கைக்கு நீங்கள் ஏற்கனவே உதவ முன்வந்துள்ளீர்கள்.",
    err: "உங்கள் உதவிப் பதிவைச் சேமிக்க முடியவில்லை. சுயவிவரம் உருவாக்கியுள்ளீர்களா என்று பார்க்கவும்.",
    best: "உங்களுக்கு மிகப் பொருத்தமானவை",
    bestSub: "உங்கள் நகரம், முந்தைய உதவி, அவசரத்தின் அடிப்படையில்.",
    rCity: "அதே நகரம்",
    rPast: "நீங்கள் முன்பு செய்த உதவி போன்றது",
    rUrg: "மிகவும் அவசரம்",
    all: "அனைத்து கோரிக்கைகள்",
    hint: "உங்களுக்காகத் தேர்ந்தெடுத்தவற்றைக் காண உள்நுழையவும்.",
    cats: ["உணவு", "மருத்துவ உதவி", "கல்வி", "நிதி உதவி", "அத்தியாவசிய சேவைகள் (மின்சாரம், தண்ணீர்)", "அவசர நிலை"],
    urgs: ["சில நாட்கள் காத்திருக்கலாம்", "ஒன்று அல்லது இரண்டு நாட்களில்", "மிகவும் அவசரம்"],
  },
  ml: {
    back: "← ഹോമിലേക്ക് മടങ്ങുക",
    profile: "എന്റെ പ്രൊഫൈൽ",
    join: "സൈൻ അപ്പ് / ലോഗിൻ",
    title: "സഹായം ആവശ്യമുള്ളവർ",
    sub: "ഇവിടെയുള്ള ഓരോ അഭ്യർത്ഥനയും ഞങ്ങളുടെ ടീം പരിശോധിച്ചതാണ്.",
    allCats: "എല്ലാ വിഭാഗങ്ങളും",
    allCities: "എല്ലാ നഗരങ്ങളും",
    loading: "ലോഡ് ചെയ്യുന്നു…",
    none: "ഇപ്പോൾ പൊരുത്തപ്പെടുന്ന പരിശോധിച്ച അഭ്യർത്ഥനകളില്ല.",
    help: "എനിക്ക് സഹായിക്കാം",
    offered: "✔ നിങ്ങൾ സഹായിക്കാമെന്ന് അറിയിച്ചു",
    thanks: "നന്ദി! സഹായം ആവശ്യമുള്ള വ്യക്തിയുമായി ഞങ്ങളുടെ ടീം നിങ്ങളെ ബന്ധിപ്പിക്കും.",
    dup: "ഈ അഭ്യർത്ഥനയിൽ നിങ്ങൾ ഇതിനകം സഹായം വാഗ്ദാനം ചെയ്തിട്ടുണ്ട്.",
    err: "നിങ്ങളുടെ വാഗ്ദാനം സേവ് ചെയ്യാനായില്ല. പ്രൊഫൈൽ ഉണ്ടാക്കിയിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുക.",
    best: "നിങ്ങൾക്ക് ഏറ്റവും അനുയോജ്യം",
    bestSub: "നിങ്ങളുടെ നഗരം, മുൻ സഹായം, അടിയന്തരത എന്നിവ അടിസ്ഥാനമാക്കി.",
    rCity: "അതേ നഗരം",
    rPast: "നിങ്ങൾ മുമ്പ് ചെയ്ത സഹായം പോലെ",
    rUrg: "വളരെ അടിയന്തരം",
    all: "എല്ലാ അഭ്യർത്ഥനകളും",
    hint: "നിങ്ങൾക്കായി തിരഞ്ഞെടുത്തവ കാണാൻ ലോഗിൻ ചെയ്യുക.",
    cats: ["ഭക്ഷണം", "ചികിത്സ", "വിദ്യാഭ്യാസം", "സാമ്പത്തിക സഹായം", "അവശ്യ സേവനങ്ങൾ (വൈദ്യുതി, വെള്ളം)", "അടിയന്തരാവസ്ഥ"],
    urgs: ["ഏതാനും ദിവസം കാത്തിരിക്കാം", "ഒന്നോ രണ്ടോ ദിവസത്തിനുള്ളിൽ", "വളരെ അടിയന്തരം"],
  },
  te: {
    back: "← హోమ్‌కు తిరిగి వెళ్ళండి",
    profile: "నా ప్రొఫైల్",
    join: "సైన్ అప్ / లాగిన్",
    title: "సహాయం అవసరమైన వారు",
    sub: "ఇక్కడి ప్రతి అభ్యర్థనను మా బృందం ధృవీకరించింది.",
    allCats: "అన్ని వర్గాలు",
    allCities: "అన్ని నగరాలు",
    loading: "లోడ్ అవుతోంది…",
    none: "ప్రస్తుతం సరిపోయే ధృవీకరించిన అభ్యర్థనలు లేవు.",
    help: "నేను సహాయం చేయగలను",
    offered: "✔ మీరు సహాయం చేస్తామని చెప్పారు",
    thanks: "ధన్యవాదాలు! సహాయం అవసరమైన వ్యక్తితో మా బృందం మిమ్మల్ని కలుపుతుంది.",
    dup: "ఈ అభ్యర్థనకు మీరు ఇప్పటికే సహాయం చేస్తామని చెప్పారు.",
    err: "మీ ఆఫర్ సేవ్ చేయలేకపోయాము. మీరు ప్రొఫైల్ సృష్టించారో లేదో చూడండి.",
    best: "మీకు బాగా సరిపోయేవి",
    bestSub: "మీ నగరం, గతంలో చేసిన సహాయం, అత్యవసరత ఆధారంగా.",
    rCity: "అదే నగరం",
    rPast: "మీరు గతంలో చేసిన సహాయం లాంటిది",
    rUrg: "చాలా అత్యవసరం",
    all: "అన్ని అభ్యర్థనలు",
    hint: "మీ కోసం ఎంచుకున్నవి చూడటానికి లాగిన్ చేయండి.",
    cats: ["ఆహారం", "వైద్య సహాయం", "విద్య", "ఆర్థిక సహాయం", "అవసరమైన సేవలు (విద్యుత్, నీరు)", "అత్యవసరం"],
    urgs: ["కొన్ని రోజులు ఆగవచ్చు", "ఒకటి రెండు రోజుల్లో", "చాలా అత్యవసరం"],
  },
};

const select = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #c9ddd7",
  fontSize: 15,
  background: "rgba(255,255,255,0.85)",
  color: "#34505a",
  fontFamily: "inherit",
};

type Match = { r: Req; score: number; reasons: ("city" | "past" | "urgent")[] };

export default function BrowsePage() {
  const router = useRouter();
  const [lang, setLang] = useLang();
  const t = T[lang];
  const [rows, setRows] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [mine, setMine] = useState<string[]>([]);
  const [myCity, setMyCity] = useState("");
  const [pastCats, setPastCats] = useState<string[]>([]);
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

        const { data: p } = await supabase
          .from("profiles")
          .select("city")
          .eq("id", uid)
          .maybeSingle();
        setMyCity(((p?.city as string) || "").trim().toLowerCase());

        const { data: ph } = await supabase
          .from("public_helps")
          .select("category")
          .eq("helper_id", uid);
        setPastCats((ph || []).map((x) => x.category as string));
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
      setMsg(error.message.includes("duplicate") ? t.dup : t.err);
      return;
    }
    setMine([...mine, id]);
    setMsg(t.thanks);
    window.scrollTo(0, 0);
  }

  function scoreOf(r: Req): Match {
    let score = 0;
    const reasons: Match["reasons"] = [];
    const rc = r.city.trim().toLowerCase();
    if (myCity && (rc === myCity || rc.includes(myCity) || myCity.includes(rc))) {
      score += 50;
      reasons.push("city");
    }
    if (pastCats.includes(r.category)) {
      score += 30;
      reasons.push("past");
    }
    if (r.urgency === URGS_EN[2]) {
      score += 20;
      reasons.push("urgent");
    } else if (r.urgency === URGS_EN[1]) {
      score += 10;
    }
    return { r, score, reasons };
  }

  const cities = Array.from(new Set(rows.map((r) => r.city.trim()))).sort();
  const shown = rows.filter(
    (r) =>
      (!cat || r.category === cat) &&
      (!city || r.city.trim().toLowerCase() === city.toLowerCase())
  );

  const matches: Match[] = userId
    ? rows
        .filter((r) => !mine.includes(r.id))
        .map(scoreOf)
        .filter((m) => m.score >= 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  const catLabel = (c: string) => {
    const i = CATS_EN.indexOf(c);
    return i >= 0 ? t.cats[i] : c;
  };
  const urgLabel = (u: string) => {
    const i = URGS_EN.indexOf(u);
    return i >= 0 ? t.urgs[i] : u;
  };
  const reasonLabel = (k: "city" | "past" | "urgent") =>
    k === "city" ? t.rCity : k === "past" ? t.rPast : t.rUrg;

  function card(r: Req, reasons: Match["reasons"] = []) {
    return (
      <div
        key={r.id}
        style={{
          background: "rgba(255,255,255,0.75)",
          border: reasons.length ? "1.5px solid #9cc7bb" : "1px solid #dbe8e4",
          borderRadius: 18,
          padding: 20,
          marginBottom: 14,
        }}
      >
        {reasons.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {reasons.map((k) => (
              <span
                key={k}
                style={{
                  background: "#d7ece5",
                  color: "#2f6a5d",
                  fontSize: 12,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                ★ {reasonLabel(k)}
              </span>
            ))}
          </div>
        )}
        <div style={{ fontSize: 13, color: "#7a9298" }}>
          {catLabel(r.category)} · {urgLabel(r.urgency)}
        </div>
        <h3 style={{ fontWeight: 500, fontSize: 20, margin: "6px 0" }}>{r.title}</h3>
        <p style={{ margin: "0 0 10px", lineHeight: 1.6, color: "#5f7b82" }}>{r.details}</p>
        <div style={{ fontSize: 15 }}>📍 {r.city}</div>
        <div style={{ marginTop: 14 }}>
          {mine.includes(r.id) ? (
            <span style={{ color: "#2f7d6d" }}>{t.offered}</span>
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
              {t.help}
            </button>
          )}
        </div>
      </div>
    );
  }

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
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <LangSelect lang={lang} setLang={setLang} />
            <Link
              href={userId ? "/profile" : "/account"}
              style={{ color: "#4f8a7c", textDecoration: "none" }}
            >
              {userId ? t.profile : t.join}
            </Link>
          </div>
        </div>

        <h1 style={{ fontWeight: 400, fontSize: 36, margin: "24px 0 6px" }}>{t.title}</h1>
        <p style={{ color: "#5f7b82", marginTop: 0 }}>{t.sub}</p>

        {msg && (
          <div
            style={{
              background: "#d7ece5",
              color: "#2f6a5d",
              padding: "12px 16px",
              borderRadius: 12,
              margin: "16px 0",
            }}
          >
            {msg}
          </div>
        )}

        {!loading && !userId && (
          <p style={{ color: "#4f8a7c" }}>
            <Link href="/account" style={{ color: "#4f8a7c" }}>
              ✨ {t.hint}
            </Link>
          </p>
        )}

        {matches.length > 0 && (
          <section style={{ margin: "24px 0 30px" }}>
            <h2 style={{ fontWeight: 400, fontSize: 24, margin: "0 0 4px" }}>✨ {t.best}</h2>
            <p style={{ color: "#7a9298", margin: "0 0 14px", fontSize: 14 }}>{t.bestSub}</p>
            {matches.map((m) => card(m.r, m.reasons))}
          </section>
        )}

        <h2 style={{ fontWeight: 400, fontSize: 24, margin: "10px 0 14px" }}>{t.all}</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "0 0 20px" }}>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={select}>
            <option value="">{t.allCats}</option>
            {CATS_EN.map((c, i) => (
              <option key={c} value={c}>
                {t.cats[i]}
              </option>
            ))}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)} style={select}>
            <option value="">{t.allCities}</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading && <p>{t.loading}</p>}
        {!loading && shown.length === 0 && <p style={{ color: "#7a9298" }}>{t.none}</p>}
        {shown.map((r) => card(r))}
      </div>
    </main>
  );
}