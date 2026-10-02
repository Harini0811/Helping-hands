"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lang = "en" | "hi" | "ta" | "ml" | "te";

type Copy = {
  back: string;
  h: string;
  sub: string;
  cat: string;
  cats: string[];
  title: string;
  ph: string;
  details: string;
  city: string;
  urg: string;
  urgs: string[];
  phone: string;
  note: string;
  submit: string;
  doneTitle: string;
  doneText: string;
  again: string;
};

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
  { code: "te", label: "తెలుగు" },
];

const T: Record<Lang, Copy> = {
  en: {
    back: "← Back to home",
    h: "Ask for help",
    sub: "Tell us what you need. Our team will verify your request before helpers can see it.",
    cat: "What kind of help do you need?",
    cats: ["Food", "Medical care", "Education", "Financial support", "Essential utilities (power, water)", "Emergency"],
    title: "Short title",
    ph: "e.g. Medicines for my mother",
    details: "Tell us more",
    city: "City or town",
    urg: "How urgent is it?",
    urgs: ["Can wait a few days", "Within a day or two", "Very urgent"],
    phone: "Mobile number",
    note: "Kept private. Shared only after a helper is matched.",
    submit: "Submit request",
    doneTitle: "Thank you. We have received your request.",
    doneText: "Our team will verify it soon. Please keep your phone nearby.",
    again: "Submit another request",
  },
  hi: {
    back: "← होम पर वापस",
    h: "मदद माँगें",
    sub: "बताइए आपको क्या चाहिए। मददगारों को दिखने से पहले हमारी टीम आपके अनुरोध की जाँच करेगी।",
    cat: "आपको किस तरह की मदद चाहिए?",
    cats: ["भोजन", "चिकित्सा", "शिक्षा", "आर्थिक सहायता", "ज़रूरी सुविधाएँ (बिजली, पानी)", "आपातकाल"],
    title: "छोटा शीर्षक",
    ph: "जैसे: माँ के लिए दवाइयाँ",
    details: "थोड़ा विस्तार से बताइए",
    city: "शहर या कस्बा",
    urg: "यह कितना ज़रूरी है?",
    urgs: ["कुछ दिन रुक सकता है", "एक-दो दिन में", "बहुत ज़रूरी"],
    phone: "मोबाइल नंबर",
    note: "गोपनीय रखा जाएगा। मददगार से जुड़ने के बाद ही साझा होगा।",
    submit: "अनुरोध भेजें",
    doneTitle: "धन्यवाद। हमें आपका अनुरोध मिल गया है।",
    doneText: "हमारी टीम जल्द ही इसकी जाँच करेगी। कृपया अपना फ़ोन पास रखें।",
    again: "एक और अनुरोध भेजें",
  },
  ta: {
    back: "← முகப்புக்குத் திரும்பு",
    h: "உதவி கேளுங்கள்",
    sub: "உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள். உதவியாளர்கள் பார்ப்பதற்கு முன் எங்கள் குழு உங்கள் கோரிக்கையைச் சரிபார்க்கும்.",
    cat: "என்ன வகை உதவி தேவை?",
    cats: ["உணவு", "மருத்துவ உதவி", "கல்வி", "நிதி உதவி", "அத்தியாவசிய சேவைகள் (மின்சாரம், தண்ணீர்)", "அவசர நிலை"],
    title: "சிறு தலைப்பு",
    ph: "எ.கா. அம்மாவுக்கு மருந்துகள்",
    details: "மேலும் விவரங்கள்",
    city: "நகரம் அல்லது ஊர்",
    urg: "எவ்வளவு அவசரம்?",
    urgs: ["சில நாட்கள் காத்திருக்கலாம்", "ஒன்று அல்லது இரண்டு நாட்களில்", "மிகவும் அவசரம்"],
    phone: "கைபேசி எண்",
    note: "ரகசியமாக வைக்கப்படும். உதவியாளருடன் இணைக்கப்பட்ட பின்பே பகிரப்படும்.",
    submit: "கோரிக்கையை அனுப்பு",
    doneTitle: "நன்றி. உங்கள் கோரிக்கை கிடைத்தது.",
    doneText: "எங்கள் குழு விரைவில் சரிபார்க்கும். உங்கள் தொலைபேசியை அருகில் வைத்திருங்கள்.",
    again: "மற்றொரு கோரிக்கை அனுப்பு",
  },
  ml: {
    back: "← ഹോമിലേക്ക് മടങ്ങുക",
    h: "സഹായം ചോദിക്കൂ",
    sub: "നിങ്ങൾക്ക് എന്താണ് വേണ്ടതെന്ന് പറയൂ. സഹായിക്കുന്നവർ കാണുന്നതിന് മുമ്പ് ഞങ്ങളുടെ ടീം നിങ്ങളുടെ അഭ്യർത്ഥന പരിശോധിക്കും.",
    cat: "ഏത് തരം സഹായമാണ് വേണ്ടത്?",
    cats: ["ഭക്ഷണം", "ചികിത്സ", "വിദ്യാഭ്യാസം", "സാമ്പത്തിക സഹായം", "അവശ്യ സേവനങ്ങൾ (വൈദ്യുതി, വെള്ളം)", "അടിയന്തരാവസ്ഥ"],
    title: "ചെറിയ തലക്കെട്ട്",
    ph: "ഉദാ: അമ്മയ്ക്കുള്ള മരുന്നുകൾ",
    details: "കൂടുതൽ വിവരങ്ങൾ",
    city: "നഗരം അല്ലെങ്കിൽ സ്ഥലം",
    urg: "എത്ര അടിയന്തരമാണ്?",
    urgs: ["ഏതാനും ദിവസം കാത്തിരിക്കാം", "ഒന്നോ രണ്ടോ ദിവസത്തിനുള്ളിൽ", "വളരെ അടിയന്തരം"],
    phone: "മൊബൈൽ നമ്പർ",
    note: "രഹസ്യമായി സൂക്ഷിക്കും. സഹായിക്കുന്ന ആളുമായി ബന്ധിപ്പിച്ച ശേഷം മാത്രം പങ്കിടും.",
    submit: "അഭ്യർത്ഥന സമർപ്പിക്കുക",
    doneTitle: "നന്ദി. നിങ്ങളുടെ അഭ്യർത്ഥന ലഭിച്ചു.",
    doneText: "ഞങ്ങളുടെ ടീം ഉടൻ പരിശോധിക്കും. ദയവായി ഫോൺ അടുത്ത് സൂക്ഷിക്കുക.",
    again: "മറ്റൊരു അഭ്യർത്ഥന സമർപ്പിക്കുക",
  },
  te: {
    back: "← హోమ్‌కు తిరిగి వెళ్ళండి",
    h: "సహాయం అడగండి",
    sub: "మీకు ఏమి కావాలో చెప్పండి. సహాయకులకు కనిపించే ముందు మా బృందం మీ అభ్యర్థనను ధృవీకరిస్తుంది.",
    cat: "ఏ రకమైన సహాయం కావాలి?",
    cats: ["ఆహారం", "వైద్య సహాయం", "విద్య", "ఆర్థిక సహాయం", "అవసరమైన సేవలు (విద్యుత్, నీరు)", "అత్యవసరం"],
    title: "చిన్న శీర్షిక",
    ph: "ఉదా. అమ్మ కోసం మందులు",
    details: "మరిన్ని వివరాలు",
    city: "నగరం లేదా ఊరు",
    urg: "ఎంత అత్యవసరం?",
    urgs: ["కొన్ని రోజులు ఆగవచ్చు", "ఒకటి రెండు రోజుల్లో", "చాలా అత్యవసరం"],
    phone: "మొబైల్ నంబర్",
    note: "గోప్యంగా ఉంచబడుతుంది. సహాయకుడితో కలిపిన తర్వాత మాత్రమే పంచుకోబడుతుంది.",
    submit: "అభ్యర్థనను పంపండి",
    doneTitle: "ధన్యవాదాలు. మీ అభ్యర్థన అందింది.",
    doneText: "మా బృందం త్వరలో ధృవీకరిస్తుంది. దయచేసి మీ ఫోన్‌ను దగ్గర ఉంచుకోండి.",
    again: "మరొక అభ్యర్థన పంపండి",
  },
};

const field = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #c9ddd7",
  background: "rgba(255,255,255,0.85)",
  color: "#34505a",
  fontSize: 16,
  fontFamily: "inherit",
  boxSizing: "border-box" as const,
};

const label = {
  display: "block",
  margin: "20px 0 6px",
  fontSize: 15,
  color: "#4a6a70",
};

export default function RequestPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [done, setDone] = useState(false);
  const t = T[lang];

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("lang");
    if (p && p in T) setLang(p as Lang);
  }, []);

  return (
    <main
      lang={lang}
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f7f2ea 0%, #eaf2ef 50%, #e4eef5 100%)",
        color: "#34505a",
        fontFamily: "Georgia, 'Nirmala UI', 'Segoe UI', serif",
        padding: "20px 16px 60px",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid #b9d3cc",
              background: lang === l.code ? "#6aa89a" : "rgba(255,255,255,0.6)",
              color: lang === l.code ? "white" : "#4a6a70",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {l.label}
          </button>
        ))}
      </nav>

      <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: 30 }}>
        <Link
          href="/"
          style={{ color: "#4f8a7c", textDecoration: "none", fontSize: 15 }}
        >
          {t.back}
        </Link>

        {done ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 56 }}>🌱</div>
            <h1 style={{ fontWeight: 400, fontSize: 30, lineHeight: 1.4 }}>
              {t.doneTitle}
            </h1>
            <p style={{ color: "#5f7b82", lineHeight: 1.8 }}>{t.doneText}</p>
            <button
              onClick={() => setDone(false)}
              style={{
                marginTop: 20,
                background: "#6aa89a",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: 999,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {t.again}
            </button>
          </div>
        ) : (
          <>
            <h1 style={{ fontWeight: 400, fontSize: 36, margin: "24px 0 8px" }}>
              {t.h}
            </h1>
            <p style={{ color: "#5f7b82", lineHeight: 1.7, marginTop: 0 }}>
              {t.sub}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
                window.scrollTo(0, 0);
              }}
            >
              <label style={label}>{t.cat}</label>
              <select required style={field} defaultValue="">
                <option value="" disabled></option>
                {t.cats.map((c, i) => (
                  <option key={i} value={i}>
                    {c}
                  </option>
                ))}
              </select>

              <label style={label}>{t.title}</label>
              <input required maxLength={80} placeholder={t.ph} style={field} />

              <label style={label}>{t.details}</label>
              <textarea required rows={4} style={field} />

              <label style={label}>{t.city}</label>
              <input required style={field} />

              <label style={label}>{t.urg}</label>
              <select required style={field} defaultValue="">
                <option value="" disabled></option>
                {t.urgs.map((u, i) => (
                  <option key={i} value={i}>
                    {u}
                  </option>
                ))}
              </select>

              <label style={label}>{t.phone}</label>
              <input
                required
                inputMode="tel"
                pattern="[0-9+ ]{10,13}"
                style={field}
              />
              <small style={{ color: "#7a9298" }}>{t.note}</small>

              <button
                type="submit"
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 28,
                  background: "#6aa89a",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: 999,
                  fontSize: 17,
                  cursor: "pointer",
                }}
              >
                {t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}