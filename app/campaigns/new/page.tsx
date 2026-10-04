"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useLang, LangSelect, type Lang } from "../../../lib/i18n";

type Copy = {
  back: string;
  title: string;
  loading: string;
  notVerified: string;
  thanks: string;
  name: string;
  desc: string;
  city: string;
  goal: string;
  upi: string;
  submit: string;
  err: string;
  food: string;
  disaster: string;
  health: string;
  other: string;
};

const T: Record<Lang, Copy> = {
  en: {
    back: "← Back to campaigns",
    title: "Start a campaign",
    loading: "Loading…",
    notVerified: "Only verified organizations can start campaigns. If you registered as an organization, please wait for our team to verify you.",
    thanks: "Thank you. Your campaign was submitted. It will appear publicly once our team approves it.",
    name: "Campaign title",
    desc: "Tell people what the money will be used for",
    city: "City or area",
    goal: "Goal amount in ₹ (optional)",
    upi: "Organization UPI ID (e.g. name@bank)",
    submit: "Submit for approval",
    err: "Could not submit. Please try again.",
    food: "Food supply",
    disaster: "Disaster relief",
    health: "Health & disease",
    other: "Other",
  },
  hi: {
    back: "← अभियानों पर वापस",
    title: "अभियान शुरू करें",
    loading: "लोड हो रहा है…",
    notVerified: "केवल जाँची हुई संस्थाएँ ही अभियान शुरू कर सकती हैं। अगर आपने संस्था के रूप में पंजीकरण किया है, तो कृपया हमारी टीम की जाँच का इंतज़ार करें।",
    thanks: "धन्यवाद। आपका अभियान जमा हो गया है। हमारी टीम की मंज़ूरी के बाद यह सबको दिखेगा।",
    name: "अभियान का शीर्षक",
    desc: "बताइए कि पैसे का उपयोग किस काम में होगा",
    city: "शहर या इलाका",
    goal: "लक्ष्य राशि ₹ में (वैकल्पिक)",
    upi: "संस्था की UPI ID (जैसे name@bank)",
    submit: "मंज़ूरी के लिए भेजें",
    err: "जमा नहीं हो सका। कृपया फिर से कोशिश करें।",
    food: "भोजन आपूर्ति",
    disaster: "आपदा राहत",
    health: "स्वास्थ्य और बीमारी",
    other: "अन्य",
  },
  ta: {
    back: "← பிரச்சாரங்களுக்குத் திரும்பு",
    title: "பிரச்சாரம் தொடங்கு",
    loading: "ஏற்றுகிறது…",
    notVerified: "சரிபார்க்கப்பட்ட அமைப்புகள் மட்டுமே பிரச்சாரம் தொடங்கலாம். நீங்கள் அமைப்பாகப் பதிவு செய்திருந்தால், எங்கள் குழு சரிபார்க்கும் வரை காத்திருங்கள்.",
    thanks: "நன்றி. உங்கள் பிரச்சாரம் சமர்ப்பிக்கப்பட்டது. எங்கள் குழு அங்கீகரித்த பின் அது பொதுவில் தெரியும்.",
    name: "பிரச்சாரத் தலைப்பு",
    desc: "பணம் எதற்குப் பயன்படுத்தப்படும் என்று சொல்லுங்கள்",
    city: "நகரம் அல்லது பகுதி",
    goal: "இலக்குத் தொகை ₹ (விருப்பம்)",
    upi: "அமைப்பின் UPI ஐடி (எ.கா. name@bank)",
    submit: "அங்கீகாரத்திற்கு அனுப்பு",
    err: "சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    food: "உணவு வழங்கல்",
    disaster: "பேரிடர் நிவாரணம்",
    health: "சுகாதாரம் & நோய்",
    other: "மற்றவை",
  },
  ml: {
    back: "← ക്യാമ്പെയ്‌നുകളിലേക്ക് മടങ്ങുക",
    title: "ക്യാമ്പെയ്ൻ തുടങ്ങുക",
    loading: "ലോഡ് ചെയ്യുന്നു…",
    notVerified: "പരിശോധിച്ച സംഘടനകൾക്ക് മാത്രമേ ക്യാമ്പെയ്ൻ തുടങ്ങാനാകൂ. നിങ്ങൾ സംഘടനയായി രജിസ്റ്റർ ചെയ്തെങ്കിൽ ഞങ്ങളുടെ ടീം പരിശോധിക്കുന്നതുവരെ കാത്തിരിക്കുക.",
    thanks: "നന്ദി. നിങ്ങളുടെ ക്യാമ്പെയ്ൻ സമർപ്പിച്ചു. ഞങ്ങളുടെ ടീം അംഗീകരിച്ചാൽ അത് എല്ലാവർക്കും കാണാം.",
    name: "ക്യാമ്പെയ്ൻ തലക്കെട്ട്",
    desc: "പണം എന്തിനാണ് ഉപയോഗിക്കുന്നതെന്ന് പറയൂ",
    city: "നഗരം അല്ലെങ്കിൽ പ്രദേശം",
    goal: "ലക്ഷ്യ തുക ₹ (ഓപ്ഷണൽ)",
    upi: "സംഘടനയുടെ UPI ഐഡി (ഉദാ. name@bank)",
    submit: "അംഗീകാരത്തിനായി സമർപ്പിക്കുക",
    err: "സമർപ്പിക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക.",
    food: "ഭക്ഷണ വിതരണം",
    disaster: "ദുരന്ത സഹായം",
    health: "ആരോഗ്യം & രോഗം",
    other: "മറ്റുള്ളവ",
  },
  te: {
    back: "← ప్రచారాలకు తిరిగి వెళ్ళండి",
    title: "ప్రచారం ప్రారంభించండి",
    loading: "లోడ్ అవుతోంది…",
    notVerified: "ధృవీకరించిన సంస్థలు మాత్రమే ప్రచారాలు ప్రారంభించగలవు. మీరు సంస్థగా నమోదు చేసుకుంటే, మా బృందం ధృవీకరించే వరకు వేచి ఉండండి.",
    thanks: "ధన్యవాదాలు. మీ ప్రచారం సమర్పించబడింది. మా బృందం ఆమోదించిన తర్వాత ఇది అందరికీ కనిపిస్తుంది.",
    name: "ప్రచారం శీర్షిక",
    desc: "డబ్బును దేనికి ఉపయోగిస్తారో చెప్పండి",
    city: "నగరం లేదా ప్రాంతం",
    goal: "లక్ష్య మొత్తం ₹ (ఐచ్ఛికం)",
    upi: "సంస్థ UPI ఐడి (ఉదా. name@bank)",
    submit: "ఆమోదం కోసం పంపండి",
    err: "సమర్పించలేకపోయాము. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    food: "ఆహార సరఫరా",
    disaster: "విపత్తు సహాయం",
    health: "ఆరోగ్యం & వ్యాధి",
    other: "ఇతరాలు",
  },
};

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
  const [lang, setLang] = useLang();
  const t = T[lang];
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
    if (error) return setMsg(t.err);
    setDone(true);
  }

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
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <Link href="/campaigns" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            {t.back}
          </Link>
          <LangSelect lang={lang} setLang={setLang} />
        </div>
        <h1 style={{ fontWeight: 400, marginTop: 24 }}>{t.title}</h1>

        {ok === null && <p>{t.loading}</p>}
        {ok === false && <p style={{ lineHeight: 1.7 }}>{t.notVerified}</p>}
        {done && <p style={{ lineHeight: 1.7 }}>{t.thanks}</p>}
        {ok && !done && (
          <form onSubmit={onSubmit}>
            <input name="title" required placeholder={t.name} style={box} />
            <select name="kind" required style={box} defaultValue="food">
              <option value="food">{t.food}</option>
              <option value="disaster">{t.disaster}</option>
              <option value="health">{t.health}</option>
              <option value="other">{t.other}</option>
            </select>
            <textarea name="description" required rows={5} placeholder={t.desc} style={box} />
            <input name="city" required placeholder={t.city} style={box} />
            <input name="goal" type="number" min={0} placeholder={t.goal} style={box} />
            <input name="upi" required placeholder={t.upi} style={box} />
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
              {t.submit}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}