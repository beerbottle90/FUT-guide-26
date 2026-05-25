import { useState } from "react";
import ScreenshotAnalyzer from "./components/ScreenshotAnalyzer";
import SquadBuilder from "./components/SquadBuilder";
import SBCSolver from "./components/SBCSolver";
import MarketAdvisor from "./components/MarketAdvisor";
import { useLang } from "./context/LangContext";
import { TranslationKey } from "./i18n";

type Tab = "analyze" | "squad" | "sbc" | "market";

const TAB_KEYS: { id: Tab; key: TranslationKey }[] = [
  { id: "analyze", key: "tab_analyze" },
  { id: "squad",   key: "tab_squad"   },
  { id: "sbc",     key: "tab_sbc"     },
  { id: "market",  key: "tab_market"  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");
  const { lang, setLang, t } = useLang();

  return (
    <>
      <div className="bg-emblem">
        <img src="/arthurball-26.png" alt="" />
      </div>

      <div className="app">
        <header className="header">
          <div className="lang-switcher">
            <button
              className={`lang-btn ${lang === "tr" ? "active" : ""}`}
              onClick={() => setLang("tr")}
              title="Türkçe"
            >
              <img src="/flag-tr.svg" alt="TR" />
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
              title="English"
            >
              <img src="/flag-en.svg" alt="EN" />
            </button>
          </div>

          <img
            src="/arthurball-26.png"
            alt="arthurball '26"
            className="header-emblem"
          />
          <h1>
            ARTHURBALL <span className="year">'26</span>
          </h1>
          <p className="header-sub">AI ULTIMATE TEAM ADVISOR</p>
          <div className="header-line" />
        </header>

        <nav className="nav">
          {TAB_KEYS.map(({ id, key }) => (
            <button
              key={id}
              className={`nav-btn ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {t(key)}
            </button>
          ))}
        </nav>

        <main>
          {activeTab === "analyze" && <ScreenshotAnalyzer />}
          {activeTab === "squad"   && <SquadBuilder />}
          {activeTab === "sbc"     && <SBCSolver />}
          {activeTab === "market"  && <MarketAdvisor />}
        </main>

        <footer className="footer">
          DESIGNER: ERTUĞ DEMİR &nbsp;·&nbsp; CODED BY CLAUDE CODE
        </footer>
      </div>
    </>
  );
}
