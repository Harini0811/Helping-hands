"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "hi" | "ta" | "ml" | "te";

type Copy = {
  h1: string;
  sub: string;
  need: string;
  help: string;
  how: string;
  steps: { title: string; text: string }[];
  foot: string;
};

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
  { code: "te", label: "తెలుగు" },
];

const ICONS = ["📝", "🔎", "🤝", "🌱"];

const T: Record<Lang, Copy> = {
  en: {
    h1: "Hope begins with a helping hand.",
    sub: "Helping Hands connects people in need with people who care. Every request is verified, and every kindness is tracked.",
    need: "I need help",
    help: "I want to help",
    how: "How it works",
    steps: [
      { title: "Ask for help", text: "Tell us what you need, where you are, and how urgent it is. It takes only a few minutes." },
      { title: "We verify", text: "Our team and local partners check every request, so help reaches real people." },
      { title: "Kind people step in", text: "Volunteers, NGOs and donors near you see verified requests and choose how to help." },
      { title: "See the impact", text: "Follow each request until help is delivered, so everyone can trust the process." },
    ],
    foot: "Available in five Indian languages. Made with care.",
  },
  hi: {
    h1: "उम्मीद एक मदद भरे हाथ से शुरू होती है।",
    sub: "हेल्पिंग हैंड्स ज़रूरतमंद लोगों को मदद करने वाले लोगों से जोड़ता है। हर अनुरोध की जाँच होती है और हर मदद का हिसाब रखा जाता है।",
    need: "मुझे मदद चाहिए",
    help: "मैं मदद करना चाहता/चाहती हूँ",
    how: "यह कैसे काम करता है",
    steps: [
      { title: "मदद माँगें", text: "बताइए कि आपको क्या चाहिए, आप कहाँ हैं और कितनी जल्दी चाहिए। इसमें बस कुछ मिनट लगते हैं।" },
      { title: "हम जाँच करते हैं", text: "हमारी टीम और स्थानीय साथी हर अनुरोध की जाँच करते हैं, ताकि मदद सच्चे लोगों तक पहुँचे।" },
      { title: "दयालु लोग आगे आते हैं", text: "आपके पास के स्वयंसेवक, एनजीओ और दानदाता जाँचे हुए अनुरोध देखते हैं और मदद का तरीका चुनते हैं।" },
      { title: "असर देखें", text: "मदद पहुँचने तक हर अनुरोध को ट्रैक करें, ताकि सब पर भरोसा बना रहे।" },
    ],
    foot: "पाँच भारतीय भाषाओं में उपलब्ध। प्यार से बनाया गया।",
  },
  ta: {
    h1: "நம்பிக்கை ஒரு உதவிக் கரத்திலிருந்து தொடங்குகிறது.",
    sub: "ஹெல்ப்பிங் ஹேண்ட்ஸ், உதவி தேவைப்படுபவர்களை உதவ விரும்புபவர்களுடன் இணைக்கிறது. ஒவ்வொரு கோரிக்கையும் சரிபார்க்கப்படுகிறது, ஒவ்வொரு உதவியும் கண்காணிக்கப்படுகிறது.",
    need: "எனக்கு உதவி வேண்டும்",
    help: "நான் உதவ விரும்புகிறேன்",
    how: "இது எப்படி செயல்படுகிறது",
    steps: [
      { title: "உதவி கேளுங்கள்", text: "உங்களுக்கு என்ன தேவை, நீங்கள் எங்கே இருக்கிறீர்கள், எவ்வளவு அவசரம் என்பதைச் சொல்லுங்கள். சில நிமிடங்களே ஆகும்." },
      { title: "நாங்கள் சரிபார்க்கிறோம்", text: "எங்கள் குழுவும் உள்ளூர் கூட்டாளிகளும் ஒவ்வொரு கோரிக்கையையும் சரிபார்க்கிறார்கள், உதவி உண்மையான மக்களைச் சென்றடைய." },
      { title: "நல்லுள்ளங்கள் முன்வருகின்றன", text: "உங்கள் அருகிலுள்ள தன்னார்வலர்கள், தொண்டு நிறுவனங்கள், நன்கொடையாளர்கள் சரிபார்க்கப்பட்ட கோரிக்கைகளைப் பார்த்து உதவும் வழியைத் தேர்ந்தெடுக்கிறார்கள்." },
      { title: "பலனைப் பாருங்கள்", text: "உதவி சென்றடையும் வரை ஒவ்வொரு கோரிக்கையையும் பின்தொடருங்கள், அனைவரும் நம்பிக்கை வைக்கலாம்." },
    ],
    foot: "ஐந்து இந்திய மொழிகளில் கிடைக்கிறது. அன்புடன் உருவாக்கப்பட்டது.",
  },
  ml: {
    h1: "പ്രതീക്ഷ തുടങ്ങുന്നത് സഹായിക്കുന്ന ഒരു കൈയിൽ നിന്നാണ്.",
    sub: "ഹെൽപ്പിംഗ് ഹാൻഡ്സ് സഹായം ആവശ്യമുള്ളവരെ സഹായിക്കാൻ മനസ്സുള്ളവരുമായി ബന്ധിപ്പിക്കുന്നു. ഓരോ അഭ്യർത്ഥനയും പരിശോധിക്കപ്പെടുന്നു, ഓരോ സഹായവും രേഖപ്പെടുത്തപ്പെടുന്നു.",
    need: "എനിക്ക് സഹായം വേണം",
    help: "എനിക്ക് സഹായിക്കണം",
    how: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
    steps: [
      { title: "സഹായം ചോദിക്കൂ", text: "നിങ്ങൾക്ക് എന്താണ് വേണ്ടത്, എവിടെയാണ്, എത്ര അടിയന്തരമാണ് എന്ന് പറയൂ. കുറച്ച് മിനിറ്റ് മതി." },
      { title: "ഞങ്ങൾ പരിശോധിക്കുന്നു", text: "ഞങ്ങളുടെ ടീമും പ്രാദേശിക പങ്കാളികളും ഓരോ അഭ്യർത്ഥനയും പരിശോധിക്കുന്നു, സഹായം യഥാർത്ഥ ആളുകളിലേക്ക് എത്താൻ." },
      { title: "നല്ല മനസ്സുള്ളവർ മുന്നോട്ട് വരുന്നു", text: "നിങ്ങളുടെ അടുത്തുള്ള സന്നദ്ധപ്രവർത്തകർ, എൻജിഒകൾ, ദാതാക്കൾ എന്നിവർ പരിശോധിച്ച അഭ്യർത്ഥനകൾ കണ്ട് സഹായിക്കാനുള്ള വഴി തിരഞ്ഞെടുക്കുന്നു." },
      { title: "ഫലം കാണൂ", text: "സഹായം എത്തുന്നതുവരെ ഓരോ അഭ്യർത്ഥനയും പിന്തുടരാം, എല്ലാവർക്കും വിശ്വസിക്കാൻ കഴിയും." },
    ],
    foot: "അഞ്ച് ഇന്ത്യൻ ഭാഷകളിൽ ലഭ്യമാണ്. സ്നേഹത്തോടെ നിർമ്മിച്ചത്.",
  },
  te: {
    h1: "ఆశ ఒక సహాయం చేసే చేతితో మొదలవుతుంది.",
    sub: "హెల్పింగ్ హ్యాండ్స్ సహాయం అవసరమైన వారిని సహాయం చేయాలనుకునే వారితో కలుపుతుంది. ప్రతి అభ్యర్థన ధృవీకరించబడుతుంది, ప్రతి సహాయం నమోదు చేయబడుతుంది.",
    need: "నాకు సహాయం కావాలి",
    help: "నేను సహాయం చేయాలనుకుంటున్నాను",
    how: "ఇది ఎలా పనిచేస్తుంది",
    steps: [
      { title: "సహాయం అడగండి", text: "మీకు ఏమి కావాలో, మీరు ఎక్కడ ఉన్నారో, ఎంత అత్యవసరమో చెప్పండి. కొన్ని నిమిషాలు చాలు." },
      { title: "మేము ధృవీకరిస్తాము", text: "మా బృందం మరియు స్థానిక భాగస్వాములు ప్రతి అభ్యర్థనను తనిఖీ చేస్తారు, సహాయం నిజమైన వారికి చేరేలా." },
      { title: "మంచి మనసులు ముందుకొస్తాయి", text: "మీ దగ్గరలోని వాలంటీర్లు, ఎన్జీఓలు, దాతలు ధృవీకరించిన అభ్యర్థనలను చూసి సహాయం చేసే మార్గాన్ని ఎంచుకుంటారు." },
      { title: "ప్రభావాన్ని చూడండి", text: "సహాయం చేరే వరకు ప్రతి అభ్యర్థనను అనుసరించండి, అందరూ నమ్మవచ్చు." },
    ],
    foot: "ఐదు భారతీయ భాషల్లో అందుబాటులో ఉంది. ప్రేమతో రూపొందించబడింది.",
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  return (
    <main
      lang={lang}
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f7f2ea 0%, #eaf2ef 50%, #e4eef5 100%)",
        color: "#34505a",
        fontFamily: "Georgia, 'Nirmala UI', 'Segoe UI', serif",
      }}
    >
      {/* Language switcher */}
      <nav
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "20px 16px 0",
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

      {/* Hero */}
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 20 }}>🤝</div>
        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.3,
            margin: 0,
            maxWidth: 820,
          }}
        >
          {t.h1}
        </h1>
        <p
          style={{
            maxWidth: 580,
            fontSize: "clamp(16px, 2.2vw, 20px)",
            lineHeight: 1.8,
            color: "#5f7b82",
            marginTop: 24,
          }}
        >
          {t.sub}
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 36,
          }}
        >
          <Link
            href={`/request?lang=${lang}`}
            style={{
              background: "#6aa89a",
              color: "white",
              padding: "14px 30px",
              borderRadius: 999,
              fontSize: 17,
              textDecoration: "none",
            }}
          >
            {t.need}
          </Link>
          
          <Link
            href="/browse"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "#4f8a7c",
              border: "1.5px solid #8fbfb3",
              padding: "14px 30px",
              borderRadius: 999,
              fontSize: 17,
              textDecoration: "none",
            }}
          >
            {t.help}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 24px 60px" }}>
        <h2
          style={{
            textAlign: "center",
            fontWeight: 400,
            fontSize: "clamp(26px, 4vw, 36px)",
            marginBottom: 32,
          }}
        >
          {t.how}
        </h2>
        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {t.steps.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: 20,
                padding: "26px 22px",
                textAlign: "center",
                border: "1px solid #dbe8e4",
              }}
            >
              <div style={{ fontSize: 34 }}>{ICONS[i]}</div>
              <div style={{ fontSize: 13, color: "#7fa89e", margin: "8px 0 4px" }}>
                {i + 1}
              </div>
              <h3 style={{ fontWeight: 500, fontSize: 19, margin: "0 0 10px" }}>
                {s.title}
              </h3>
              <p style={{ margin: 0, color: "#5f7b82", lineHeight: 1.7, fontSize: 15 }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          textAlign: "center",
          padding: "0 16px 40px",
          color: "#7a9298",
          fontSize: 14,
        }}
      >
        {t.foot}
      </footer>
    </main>
  );
}
