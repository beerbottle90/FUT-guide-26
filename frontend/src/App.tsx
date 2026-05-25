import { useState } from "react";
import ScreenshotAnalyzer from "./components/ScreenshotAnalyzer";
import SquadBuilder from "./components/SquadBuilder";
import SBCSolver from "./components/SBCSolver";
import MarketAdvisor from "./components/MarketAdvisor";

type Tab = "analyze" | "squad" | "sbc" | "market";

const TABS: { id: Tab; label: string }[] = [
  { id: "analyze", label: "📸 Ekran Analizi" },
  { id: "squad", label: "👥 Kadro Kur" },
  { id: "sbc", label: "🧩 SBC Çöz" },
  { id: "market", label: "📈 Market" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");

  return (
    <div className="app">
      <header className="header">
        <h1>⚽ FUT Arthur Guide</h1>
        <p>AI destekli EA FC Ultimate Team danışmanı</p>
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
        {activeTab === "squad" && <SquadBuilder />}
        {activeTab === "sbc" && <SBCSolver />}
        {activeTab === "market" && <MarketAdvisor />}
      </main>
    </div>
  );
}
