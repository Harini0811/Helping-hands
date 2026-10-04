"use client";

import { useLang } from "../lib/i18n";
import Link from "next/link";

type Lang = "en" | "hi" | "ta" | "ml" | "te";

type Copy = {
  h1: string;
  sub: string;
  need: string;
  help: string;
  camp: string;
  signin: string;
  trust: string[];
  how: string;
  steps: { title: string; text: string }[];
  whoTitle: string;
  who: { title: string; text: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaBtn: string;
  foot: string;
};

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
  { code: "te", label: "తెలుగు" },
];

const STEP_ICONS = ["📝", "🔎", "🤝", "🌱"];
const WHO_ICONS = ["💛", "🙋", "🏠"];

const T: Record<Lang, Copy> = {
  en: {
    h1: "Hope begins with a helping hand.",
    sub: "Helping Hands connects people in need with people who care. Every request is verified, and every kindness is tracked.",
    need: "I need help",
    help: "I want to help",
    camp: "Campaigns",
    signin: "Log in",
    trust: ["Every request verified", "Every help tracked", "Donations go directly to organizations"],
    how: "How it works",
    steps: [
      { title: "Ask for help", text: "Tell us what you need, where you are, and how urgent it is. It takes only a few minutes." },
      { title: "We verify", text: "Our team and local partners check every request, so help reaches real people." },
      { title: "Kind people step in", text: "Volunteers, NGOs and donors near you see verified requests and choose how to help." },
      { title: "See the impact", text: "Follow each request until help is delivered, so everyone can trust the process." },
    ],
    whoTitle: "Who can join",
    who: [
      { title: "Individuals", text: "Give your time, food or support to someone nearby." },
      { title: "Volunteers", text: "Take up verified requests in your city and watch your impact grow." },
      { title: "Organizations", text: "NGOs, old age homes and orphanages can run campaigns and build a trusted profile." },
    ],
    ctaTitle: "Support a cause",
    ctaText: "Verified organizations run campaigns for food, disaster relief and health. Give directly to them.",
    ctaBtn: "See campaigns",
    foot: "Available in five Indian languages. Made with care.",
  },
  hi: {
    h1: "उम्मीद एक मदद भरे हाथ से शुरू होती है।",
    sub: "हेल्पिंग हैंड्स ज़रूरतमंद लोगों को मदद करने वाले लोगों से जोड़ता है। हर अनुरोध की जाँच होती है और हर मदद का हिसाब रखा जाता है।",
    need: "मुझे मदद चाहिए",
    help: "मैं मदद करना चाहता/चाहती हूँ",
    camp: "अभियान",
    signin: "लॉग इन",
    trust: ["हर अनुरोध की जाँच", "हर मदद का हिसाब", "दान सीधे संस्थाओं तक"],
    how: "यह कैसे काम करता है",
    steps: [
      { title: "मदद माँगें", text: "बताइए कि आपको क्या चाहिए, आप कहाँ हैं और कितनी जल्दी चाहिए। इसमें बस कुछ मिनट लगते हैं।" },
      { title: "हम जाँच करते हैं", text: "हमारी टीम और स्थानीय साथी हर अनुरोध की जाँच करते हैं, ताकि मदद सच्चे लोगों तक पहुँचे।" },
      { title: "दयालु लोग आगे आते हैं", text: "आपके पास के स्वयंसेवक, एनजीओ और दानदाता जाँचे हुए अनुरोध देखते हैं और मदद का तरीका चुनते हैं।" },
      { title: "असर देखें", text: "मदद पहुँचने तक हर अनुरोध को ट्रैक करें, ताकि सब पर भरोसा बना रहे।" },
    ],
    whoTitle: "कौन जुड़ सकता है",
    who: [
      { title: "व्यक्ति", text: "अपने आस-पास किसी को समय, भोजन या सहयोग दें।" },
      { title: "स्वयंसेवक", text: "अपने शहर के जाँचे हुए अनुरोध लें और अपना असर बढ़ता देखें।" },
      { title: "संस्थाएँ", text: "एनजीओ, वृद्धाश्रम और अनाथालय अभियान चला सकते हैं और भरोसेमंद प्रोफ़ाइल बना सकते हैं।" },
    ],
    ctaTitle: "किसी अच्छे काम का साथ दें",
    ctaText: "जाँची हुई संस्थाएँ भोजन, आपदा राहत और स्वास्थ्य के लिए अभियान चलाती हैं। सीधे उन्हें दान दें।",
    ctaBtn: "अभियान देखें",
    foot: "पाँच भारतीय भाषाओं में उपलब्ध। प्यार से बनाया गया।",
  },
  ta: {
    h1: "நம்பிக்கை ஒரு உதவிக் கரத்திலிருந்து தொடங்குகிறது.",
    sub: "ஹெல்ப்பிங் ஹேண்ட்ஸ், உதவி தேவைப்படுபவர்களை உதவ விரும்புபவர்களுடன் இணைக்கிறது. ஒவ்வொரு கோரிக்கையும் சரிபார்க்கப்படுகிறது, ஒவ்வொரு உதவியும் கண்காணிக்கப்படுகிறது.",
    need: "எனக்கு உதவி வேண்டும்",
    help: "நான் உதவ விரும்புகிறேன்",
    camp: "பிரச்சாரங்கள்",
    signin: "உள்நுழை",
    trust: ["ஒவ்வொரு கோரிக்கையும் சரிபார்க்கப்படுகிறது", "ஒவ்வொரு உதவியும் கண்காணிக்கப்படுகிறது", "நன்கொடை நேரடியாக அமைப்புகளுக்கு"],
    how: "இது எப்படி செயல்படுகிறது",
    steps: [
      { title: "உதவி கேளுங்கள்", text: "உங்களுக்கு என்ன தேவை, நீங்கள் எங்கே இருக்கிறீர்கள், எவ்வளவு அவசரம் என்பதைச் சொல்லுங்கள். சில நிமிடங்களே ஆகும்." },
      { title: "நாங்கள் சரிபார்க்கிறோம்", text: "எங்கள் குழுவும் உள்ளூர் கூட்டாளிகளும் ஒவ்வொரு கோரிக்கையையும் சரிபார்க்கிறார்கள், உதவி உண்மையான மக்களைச் சென்றடைய." },
      { title: "நல்லுள்ளங்கள் முன்வருகின்றன", text: "உங்கள் அருகிலுள்ள தன்னார்வலர்கள், தொண்டு நிறுவனங்கள், நன்கொடையாளர்கள் சரிபார்க்கப்பட்ட கோரிக்கைகளைப் பார்த்து உதவும் வழியைத் தேர்ந்தெடுக்கிறார்கள்." },
      { title: "பலனைப் பாருங்கள்", text: "உதவி சென்றடையும் வரை ஒவ்வொரு கோரிக்கையையும் பின்தொடருங்கள், அனைவரும் நம்பிக்கை வைக்கலாம்." },
    ],
    whoTitle: "யார் இணையலாம்",
    who: [
      { title: "தனிநபர்கள்", text: "அருகிலுள்ள ஒருவருக்கு உங்கள் நேரம், உணவு அல்லது ஆதரவை வழங்குங்கள்." },
      { title: "தன்னார்வலர்கள்", text: "உங்கள் நகரில் சரிபார்க்கப்பட்ட கோரிக்கைகளை ஏற்று உங்கள் தாக்கம் வளர்வதைப் பாருங்கள்." },
      { title: "அமைப்புகள்", text: "தொண்டு நிறுவனங்கள், முதியோர் இல்லங்கள், அனாதை இல்லங்கள் பிரச்சாரங்களை நடத்தி நம்பகமான சுயவிவரத்தை உருவாக்கலாம்." },
    ],
    ctaTitle: "ஒரு நல்ல நோக்கத்தை ஆதரியுங்கள்",
    ctaText: "சரிபார்க்கப்பட்ட அமைப்புகள் உணவு, பேரிடர் நிவாரணம், சுகாதாரத்திற்காக பிரச்சாரங்களை நடத்துகின்றன. நேரடியாக அவர்களுக்கு வழங்குங்கள்.",
    ctaBtn: "பிரச்சாரங்களைப் பார்",
    foot: "ஐந்து இந்திய மொழிகளில் கிடைக்கிறது. அன்புடன் உருவாக்கப்பட்டது.",
  },
  ml: {
    h1: "പ്രതീക്ഷ തുടങ്ങുന്നത് സഹായിക്കുന്ന ഒരു കൈയിൽ നിന്നാണ്.",
    sub: "ഹെൽപ്പിംഗ് ഹാൻഡ്സ് സഹായം ആവശ്യമുള്ളവരെ സഹായിക്കാൻ മനസ്സുള്ളവരുമായി ബന്ധിപ്പിക്കുന്നു. ഓരോ അഭ്യർത്ഥനയും പരിശോധിക്കപ്പെടുന്നു, ഓരോ സഹായവും രേഖപ്പെടുത്തപ്പെടുന്നു.",
    need: "എനിക്ക് സഹായം വേണം",
    help: "എനിക്ക് സഹായിക്കണം",
    camp: "ക്യാമ്പെയ്‌നുകൾ",
    signin: "ലോഗിൻ",
    trust: ["ഓരോ അഭ്യർത്ഥനയും പരിശോധിക്കുന്നു", "ഓരോ സഹായവും രേഖപ്പെടുത്തുന്നു", "സംഭാവന നേരിട്ട് സംഘടനകൾക്ക്"],
    how: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
    steps: [
      { title: "സഹായം ചോദിക്കൂ", text: "നിങ്ങൾക്ക് എന്താണ് വേണ്ടത്, എവിടെയാണ്, എത്ര അടിയന്തരമാണ് എന്ന് പറയൂ. കുറച്ച് മിനിറ്റ് മതി." },
      { title: "ഞങ്ങൾ പരിശോധിക്കുന്നു", text: "ഞങ്ങളുടെ ടീമും പ്രാദേശിക പങ്കാളികളും ഓരോ അഭ്യർത്ഥനയും പരിശോധിക്കുന്നു, സഹായം യഥാർത്ഥ ആളുകളിലേക്ക് എത്താൻ." },
      { title: "നല്ല മനസ്സുള്ളവർ മുന്നോട്ട് വരുന്നു", text: "നിങ്ങളുടെ അടുത്തുള്ള സന്നദ്ധപ്രവർത്തകർ, എൻജിഒകൾ, ദാതാക്കൾ എന്നിവർ പരിശോധിച്ച അഭ്യർത്ഥനകൾ കണ്ട് സഹായിക്കാനുള്ള വഴി തിരഞ്ഞെടുക്കുന്നു." },
      { title: "ഫലം കാണൂ", text: "സഹായം എത്തുന്നതുവരെ ഓരോ അഭ്യർത്ഥനയും പിന്തുടരാം, എല്ലാവർക്കും വിശ്വസിക്കാൻ കഴിയും." },
    ],
    whoTitle: "ആർക്കൊക്കെ ചേരാം",
    who: [
      { title: "വ്യക്തികൾ", text: "അടുത്തുള്ള ഒരാൾക്ക് നിങ്ങളുടെ സമയമോ ഭക്ഷണമോ പിന്തുണയോ നൽകൂ." },
      { title: "സന്നദ്ധപ്രവർത്തകർ", text: "നിങ്ങളുടെ നഗരത്തിലെ പരിശോധിച്ച അഭ്യർത്ഥനകൾ ഏറ്റെടുത്ത് നിങ്ങളുടെ സ്വാധീനം വളരുന്നത് കാണൂ." },
      { title: "സംഘടനകൾ", text: "എൻജിഒകൾ, വൃദ്ധസദനങ്ങൾ, അനാഥാലയങ്ങൾ എന്നിവയ്ക്ക് ക്യാമ്പെയ്‌നുകൾ നടത്താനും വിശ്വസനീയമായ പ്രൊഫൈൽ ഉണ്ടാക്കാനും കഴിയും." },
    ],
    ctaTitle: "ഒരു നല്ല ലക്ഷ്യത്തെ പിന്തുണയ്ക്കൂ",
    ctaText: "പരിശോധിച്ച സംഘടനകൾ ഭക്ഷണം, ദുരന്ത സഹായം, ആരോഗ്യം എന്നിവയ്ക്കായി ക്യാമ്പെയ്‌നുകൾ നടത്തുന്നു. അവർക്ക് നേരിട്ട് നൽകൂ.",
    ctaBtn: "ക്യാമ്പെയ്‌നുകൾ കാണുക",
    foot: "അഞ്ച് ഇന്ത്യൻ ഭാഷകളിൽ ലഭ്യമാണ്. സ്നേഹത്തോടെ നിർമ്മിച്ചത്.",
  },
  te: {
    h1: "ఆశ ఒక సహాయం చేసే చేతితో మొదలవుతుంది.",
    sub: "హెల్పింగ్ హ్యాండ్స్ సహాయం అవసరమైన వారిని సహాయం చేయాలనుకునే వారితో కలుపుతుంది. ప్రతి అభ్యర్థన ధృవీకరించబడుతుంది, ప్రతి సహాయం నమోదు చేయబడుతుంది.",
    need: "నాకు సహాయం కావాలి",
    help: "నేను సహాయం చేయాలనుకుంటున్నాను",
    camp: "ప్రచారాలు",
    signin: "లాగిన్",
    trust: ["ప్రతి అభ్యర్థన ధృవీకరణ", "ప్రతి సహాయం నమోదు", "విరాళాలు నేరుగా సంస్థలకు"],
    how: "ఇది ఎలా పనిచేస్తుంది",
    steps: [
      { title: "సహాయం అడగండి", text: "మీకు ఏమి కావాలో, మీరు ఎక్కడ ఉన్నారో, ఎంత అత్యవసరమో చెప్పండి. కొన్ని నిమిషాలు చాలు." },
      { title: "మేము ధృవీకరిస్తాము", text: "మా బృందం మరియు స్థానిక భాగస్వాములు ప్రతి అభ్యర్థనను తనిఖీ చేస్తారు, సహాయం నిజమైన వారికి చేరేలా." },
      { title: "మంచి మనసులు ముందుకొస్తాయి", text: "మీ దగ్గరలోని వాలంటీర్లు, ఎన్జీఓలు, దాతలు ధృవీకరించిన అభ్యర్థనలను చూసి సహాయం చేసే మార్గాన్ని ఎంచుకుంటారు." },
      { title: "ప్రభావాన్ని చూడండి", text: "సహాయం చేరే వరకు ప్రతి అభ్యర్థనను అనుసరించండి, అందరూ నమ్మవచ్చు." },
    ],
    whoTitle: "ఎవరు చేరవచ్చు",
    who: [
      { title: "వ్యక్తులు", text: "దగ్గరలోని ఒకరికి మీ సమయం, ఆహారం లేదా మద్దతు ఇవ్వండి." },
      { title: "వాలంటీర్లు", text: "మీ నగరంలో ధృవీకరించిన అభ్యర్థనలను తీసుకుని మీ ప్రభావం పెరగడం చూడండి." },
      { title: "సంస్థలు", text: "ఎన్జీఓలు, వృద్ధాశ్రమాలు, అనాథాశ్రమాలు ప్రచారాలు నడిపి నమ్మకమైన ప్రొఫైల్ నిర్మించుకోవచ్చు." },
    ],
    ctaTitle: "ఒక మంచి పనికి మద్దతు ఇవ్వండి",
    ctaText: "ధృవీకరించిన సంస్థలు ఆహారం, విపత్తు సహాయం, ఆరోగ్యం కోసం ప్రచారాలు నడుపుతాయి. వారికి నేరుగా ఇవ్వండి.",
    ctaBtn: "ప్రచారాలు చూడండి",
    foot: "ఐదు భారతీయ భాషల్లో అందుబాటులో ఉంది. ప్రేమతో రూపొందించబడింది.",
  },
};

const ink = "#2f4a52";
const soft = "#5f7b82";
const green = "#5f9d8e";

const card = {
  background: "rgba(255,255,255,0.78)",
  border: "1px solid #dbe8e4",
  borderRadius: 22,
  padding: "28px 22px",
  boxShadow: "0 8px 30px rgba(80,120,120,0.08)",
};

const primary = {
  background: green,
  color: "white",
  padding: "15px 32px",
  borderRadius: 999,
  fontSize: 17,
  textDecoration: "none",
  boxShadow: "0 8px 20px rgba(95,157,142,0.35)",
};

const secondary = {
  background: "rgba(255,255,255,0.8)",
  color: "#4a8a7b",
  border: "1.5px solid #9cc7bb",
  padding: "14px 30px",
  borderRadius: 999,
  fontSize: 17,
  textDecoration: "none",
};

export default function Home() {
  const [lang, setLang] = useLang();
  const t = T[lang];

  return (
    <main
      lang={lang}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8f3ea 0%, #eaf3ef 45%, #e3eef6 100%)",
        color: ink,
        fontFamily: "Georgia, 'Nirmala UI', 'Segoe UI', serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes drift { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        .fade { animation: fadeUp 0.9s ease both; }
        .fade2 { animation: fadeUp 0.9s ease 0.15s both; }
        .fade3 { animation: fadeUp 0.9s ease 0.3s both; }
        .blob { animation: drift 9s ease-in-out infinite; }
      `}</style>

      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          padding: "16px 20px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ fontSize: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 26 }}>🤝</span> Helping Hands
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label="Language"
            style={{
              padding: "9px 14px",
              borderRadius: 999,
              border: "1px solid #b9d3cc",
              background: "rgba(255,255,255,0.8)",
              color: ink,
              fontSize: 15,
              fontFamily: "inherit",
            }}
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          <Link href="/account" style={{ color: "#4a8a7b", textDecoration: "none", fontSize: 15 }}>
            {t.signin}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 24px 60px",
        }}
      >
        <div
          className="blob"
          style={{
            position: "absolute",
            top: "8%",
            left: "-60px",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, #f7dfb5 0%, rgba(247,223,181,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="blob"
          style={{
            position: "absolute",
            bottom: "6%",
            right: "-70px",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, #bfe0d6 0%, rgba(191,224,214,0) 70%)",
            pointerEvents: "none",
            animationDelay: "2s",
          }}
        />

        <div className="fade" style={{ fontSize: 52, marginBottom: 18, position: "relative" }}>
          🤝
        </div>
        <h1
          className="fade2"
          style={{
            fontSize: "clamp(34px, 6.5vw, 68px)",
            fontWeight: 400,
            lineHeight: 1.25,
            margin: 0,
            maxWidth: 860,
            position: "relative",
          }}
        >
          {t.h1}
        </h1>
        <p
          className="fade3"
          style={{
            maxWidth: 600,
            fontSize: "clamp(16px, 2.2vw, 20px)",
            lineHeight: 1.85,
            color: soft,
            marginTop: 24,
            position: "relative",
          }}
        >
          {t.sub}
        </p>
        <div
          className="fade3"
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 38,
            position: "relative",
          }}
        >
          <Link href={`/request?lang=${lang}`} style={primary}>
            {t.need}
          </Link>
          <Link href="/browse" style={secondary}>
            {t.help}
          </Link>
          <Link href="/campaigns" style={secondary}>
            {t.camp}
          </Link>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px 50px" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {t.trust.map((x, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid #d5e6e0",
                borderRadius: 999,
                padding: "10px 22px",
                fontSize: 15,
                color: "#4a8a7b",
              }}
            >
              ✔ {x}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1050, margin: "0 auto", padding: "20px 20px 60px" }}>
        <h2 style={{ textAlign: "center", fontWeight: 400, fontSize: "clamp(26px, 4vw, 38px)", margin: "0 0 34px" }}>
          {t.how}
        </h2>
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {t.steps.map((s, i) => (
            <div key={i} style={{ ...card, textAlign: "center" }}>
              <div style={{ fontSize: 38 }}>{STEP_ICONS[i]}</div>
              <div style={{ fontSize: 13, color: "#86b0a5", margin: "10px 0 4px", letterSpacing: 1 }}>
                {i + 1}
              </div>
              <h3 style={{ fontWeight: 500, fontSize: 19, margin: "0 0 10px" }}>{s.title}</h3>
              <p style={{ margin: 0, color: soft, lineHeight: 1.75, fontSize: 15 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who can join */}
      <section style={{ maxWidth: 1050, margin: "0 auto", padding: "0 20px 60px" }}>
        <h2 style={{ textAlign: "center", fontWeight: 400, fontSize: "clamp(26px, 4vw, 38px)", margin: "0 0 34px" }}>
          {t.whoTitle}
        </h2>
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {t.who.map((w, i) => (
            <div key={i} style={card}>
              <div style={{ fontSize: 34 }}>{WHO_ICONS[i]}</div>
              <h3 style={{ fontWeight: 500, fontSize: 20, margin: "12px 0 8px" }}>{w.title}</h3>
              <p style={{ margin: 0, color: soft, lineHeight: 1.75, fontSize: 15 }}>{w.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link href="/account" style={primary}>
            {t.signin} / {lang === "en" ? "Join" : "＋"}
          </Link>
        </div>
      </section>

      {/* Campaigns band */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px 70px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #dcefe8 0%, #e8eff8 100%)",
            border: "1px solid #cfe3dc",
            borderRadius: 28,
            padding: "44px 26px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontWeight: 400, fontSize: "clamp(24px, 4vw, 34px)", margin: "0 0 12px" }}>
            {t.ctaTitle}
          </h2>
          <p style={{ maxWidth: 560, margin: "0 auto 24px", color: soft, lineHeight: 1.8 }}>
            {t.ctaText}
          </p>
          <Link href="/campaigns" style={primary}>
            {t.ctaBtn}
          </Link>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "0 16px 44px", color: "#7a9298", fontSize: 14 }}>
        🤝 Helping Hands · {t.foot}
      </footer>
    </main>
  );
}