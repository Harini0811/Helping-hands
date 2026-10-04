"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useLang, LangSelect, type Lang } from "../../lib/i18n";

type Copy = {
  back: string;
  join: string;
  welcome: string;
  individual: string;
  volunteer: string;
  organization: string;
  name: string;
  city: string;
  about: string;
  email: string;
  password: string;
  create: string;
  login: string;
  haveAcc: string;
  newHere: string;
  wrong: string;
  confirm: string;
  couldNot: string;
  profileFail: string;
};

const T: Record<Lang, Copy> = {
  en: {
    back: "← Back to home",
    join: "Join Helping Hands",
    welcome: "Welcome back",
    individual: "Individual donor",
    volunteer: "Volunteer",
    organization: "Organization (NGO, old age home, orphanage)",
    name: "Your name or organization name",
    city: "City or town",
    about: "A few words about you (optional)",
    email: "Email",
    password: "Password (6+ characters)",
    create: "Create account",
    login: "Log in",
    haveAcc: "Already have an account? Log in",
    newHere: "New here? Create an account",
    wrong: "Wrong email or password.",
    confirm: "Please confirm your email, then log in.",
    couldNot: "Could not sign up.",
    profileFail: "Account created, but the profile could not be saved.",
  },
  hi: {
    back: "← होम पर वापस",
    join: "हेल्पिंग हैंड्स से जुड़ें",
    welcome: "फिर से स्वागत है",
    individual: "व्यक्तिगत दानदाता",
    volunteer: "स्वयंसेवक",
    organization: "संस्था (एनजीओ, वृद्धाश्रम, अनाथालय)",
    name: "आपका नाम या संस्था का नाम",
    city: "शहर या कस्बा",
    about: "अपने बारे में कुछ शब्द (वैकल्पिक)",
    email: "ईमेल",
    password: "पासवर्ड (6+ अक्षर)",
    create: "खाता बनाएँ",
    login: "लॉग इन",
    haveAcc: "पहले से खाता है? लॉग इन करें",
    newHere: "नए हैं? खाता बनाएँ",
    wrong: "ईमेल या पासवर्ड गलत है।",
    confirm: "कृपया अपना ईमेल कन्फ़र्म करें, फिर लॉग इन करें।",
    couldNot: "साइन अप नहीं हो सका।",
    profileFail: "खाता बन गया, लेकिन प्रोफ़ाइल सहेजी नहीं जा सकी।",
  },
  ta: {
    back: "← முகப்புக்குத் திரும்பு",
    join: "ஹெல்ப்பிங் ஹேண்ட்ஸில் சேருங்கள்",
    welcome: "மீண்டும் வரவேற்கிறோம்",
    individual: "தனிநபர் நன்கொடையாளர்",
    volunteer: "தன்னார்வலர்",
    organization: "அமைப்பு (தொண்டு நிறுவனம், முதியோர் இல்லம், அனாதை இல்லம்)",
    name: "உங்கள் பெயர் அல்லது அமைப்பின் பெயர்",
    city: "நகரம் அல்லது ஊர்",
    about: "உங்களைப் பற்றி சில வார்த்தைகள் (விருப்பம்)",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல் (6+ எழுத்துகள்)",
    create: "கணக்கை உருவாக்கு",
    login: "உள்நுழை",
    haveAcc: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழை",
    newHere: "புதியவரா? கணக்கை உருவாக்கு",
    wrong: "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு.",
    confirm: "உங்கள் மின்னஞ்சலை உறுதிப்படுத்தி, பின் உள்நுழையவும்.",
    couldNot: "பதிவு செய்ய முடியவில்லை.",
    profileFail: "கணக்கு உருவானது, ஆனால் சுயவிவரத்தைச் சேமிக்க முடியவில்லை.",
  },
  ml: {
    back: "← ഹോമിലേക്ക് മടങ്ങുക",
    join: "ഹെൽപ്പിംഗ് ഹാൻഡ്സിൽ ചേരൂ",
    welcome: "വീണ്ടും സ്വാഗതം",
    individual: "വ്യക്തിഗത ദാതാവ്",
    volunteer: "സന്നദ്ധപ്രവർത്തകൻ",
    organization: "സംഘടന (എൻജിഒ, വൃദ്ധസദനം, അനാഥാലയം)",
    name: "നിങ്ങളുടെ പേര് അല്ലെങ്കിൽ സംഘടനയുടെ പേര്",
    city: "നഗരം അല്ലെങ്കിൽ സ്ഥലം",
    about: "നിങ്ങളെക്കുറിച്ച് ചില വാക്കുകൾ (ഓപ്ഷണൽ)",
    email: "ഇമെയിൽ",
    password: "പാസ്‌വേഡ് (6+ അക്ഷരങ്ങൾ)",
    create: "അക്കൗണ്ട് ഉണ്ടാക്കുക",
    login: "ലോഗിൻ",
    haveAcc: "അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ ചെയ്യൂ",
    newHere: "പുതിയതാണോ? അക്കൗണ്ട് ഉണ്ടാക്കൂ",
    wrong: "ഇമെയിലോ പാസ്‌വേഡോ തെറ്റാണ്.",
    confirm: "ദയവായി ഇമെയിൽ സ്ഥിരീകരിച്ച ശേഷം ലോഗിൻ ചെയ്യുക.",
    couldNot: "സൈൻ അപ്പ് ചെയ്യാനായില്ല.",
    profileFail: "അക്കൗണ്ട് ഉണ്ടാക്കി, പക്ഷേ പ്രൊഫൈൽ സേവ് ചെയ്യാനായില്ല.",
  },
  te: {
    back: "← హోమ్‌కు తిరిగి వెళ్ళండి",
    join: "హెల్పింగ్ హ్యాండ్స్‌లో చేరండి",
    welcome: "తిరిగి స్వాగతం",
    individual: "వ్యక్తిగత దాత",
    volunteer: "వాలంటీర్",
    organization: "సంస్థ (ఎన్జీఓ, వృద్ధాశ్రమం, అనాథాశ్రమం)",
    name: "మీ పేరు లేదా సంస్థ పేరు",
    city: "నగరం లేదా ఊరు",
    about: "మీ గురించి కొన్ని మాటలు (ఐచ్ఛికం)",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్ (6+ అక్షరాలు)",
    create: "ఖాతా సృష్టించండి",
    login: "లాగిన్",
    haveAcc: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ చేయండి",
    newHere: "కొత్తవారా? ఖాతా సృష్టించండి",
    wrong: "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు.",
    confirm: "దయచేసి మీ ఇమెయిల్‌ను నిర్ధారించి, తర్వాత లాగిన్ చేయండి.",
    couldNot: "సైన్ అప్ చేయలేకపోయాము.",
    profileFail: "ఖాతా సృష్టించబడింది, కానీ ప్రొఫైల్ సేవ్ కాలేదు.",
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

export default function AccountPage() {
  const router = useRouter();
  const [lang, setLang] = useLang();
  const t = T[lang];
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
      if (error) return setMsg(t.wrong);
      return router.push("/profile");
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      setBusy(false);
      return setMsg(error?.message || t.couldNot);
    }
    if (!data.session) {
      setBusy(false);
      return setMsg(t.confirm);
    }
    const { error: pErr } = await supabase.from("profiles").insert({
      id: data.user.id,
      name: String(f.get("name")),
      type: String(f.get("type")),
      city: String(f.get("city")),
      about: String(f.get("about")),
    });
    setBusy(false);
    if (pErr) return setMsg(t.profileFail);
    router.push("/profile");
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
      <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <Link href="/" style={{ color: "#4f8a7c", textDecoration: "none" }}>
            {t.back}
          </Link>
          <LangSelect lang={lang} setLang={setLang} />
        </div>
        <h1 style={{ fontWeight: 400, marginTop: 24 }}>
          {mode === "signup" ? t.join : t.welcome}
        </h1>

        {mode === "signup" && (
          <>
            <select name="type" required style={box} defaultValue="individual">
              <option value="individual">{t.individual}</option>
              <option value="volunteer">{t.volunteer}</option>
              <option value="organization">{t.organization}</option>
            </select>
            <input name="name" required placeholder={t.name} style={box} />
            <input name="city" required placeholder={t.city} style={box} />
            <textarea name="about" rows={3} placeholder={t.about} style={box} />
          </>
        )}

        <input name="email" type="email" required placeholder={t.email} style={box} />
        <input name="password" type="password" required minLength={6} placeholder={t.password} style={box} />

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
          {mode === "signup" ? t.create : t.login}
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
            {mode === "signup" ? t.haveAcc : t.newHere}
          </button>
        </p>
      </form>
    </main>
  );
}