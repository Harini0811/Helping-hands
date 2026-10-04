"use client";

import { useEffect, useState } from "react";

export type Lang = "en" | "hi" | "ta" | "ml" | "te";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
  { code: "te", label: "తెలుగు" },
];

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setL] = useState<Lang>("en");

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      const s = q || localStorage.getItem("hh_lang");
      if (s && LANGS.some((l) => l.code === s)) setL(s as Lang);
    } catch {}
  }, []);

  function setLang(l: Lang) {
    setL(l);
    try {
      localStorage.setItem("hh_lang", l);
    } catch {}
  }

  return [lang, setLang];
}

export function LangSelect({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      aria-label="Language"
      style={{
        padding: "9px 14px",
        borderRadius: 999,
        border: "1px solid #b9d3cc",
        background: "rgba(255,255,255,0.8)",
        color: "#2f4a52",
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
  );
}