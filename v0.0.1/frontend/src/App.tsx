import { useState } from "react";
import ScreenshotAnalyzer from "./components/ScreenshotAnalyzer";
import SquadBuilder from "./components/SquadBuilder";
import SBCSolver from "./components/SBCSolver";
import MarketAdvisor from "./components/MarketAdvisor";

type Tab = "analyze" | "squad" | "sbc" | "market";

const TABS: { id: Tab; label: string }[] = [
  { id: "analyze", label: "📸 EKRAN" },
  { id: "squad",   label: "👥 KADRO" },
  { id: "sbc",     label: "🧩 SBC"   },
  { id: "market",  label: "📈 MARKET" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");

  return (
    <>
      {/* fixed watermark emblem */}
      <div className="bg-emblem">
        <img src="/arthurball-26.png" alt="" />
      </div>

      <div className="app">
        <header className="header">
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
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
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
