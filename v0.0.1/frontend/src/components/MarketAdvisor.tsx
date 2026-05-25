import { useState } from "react";
import { getMarketAdvice, searchPlayer, FutPlayer } from "../api/client";
import ResultBox from "./ResultBox";

export default function MarketAdvisor() {
  const [question, setQuestion] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<FutPlayer[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePlayerSearch() {
    if (!playerName.trim()) return;
    setSearchLoading(true);
    setPlayers([]);
    try {
      const found = await searchPlayer(playerName.trim());
      setPlayers(found);
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleSubmit() {
    if (!question.trim()) {
      setError("Bir soru girin");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const advice = await getMarketAdvice(question, playerName || undefined);
      setResult(advice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>📈 Market Danışmanı</h2>

        <div className="form-group">
          <label>Oyuncu Ara — fut.gg canlı fiyat</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePlayerSearch()}
              placeholder="Mbappe, Bellingham, Salah..."
              style={{ flex: 1 }}
            />
            <button
              className="btn"
              onClick={handlePlayerSearch}
              disabled={searchLoading || !playerName.trim()}
              style={{
                background: "var(--card2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "10px 16px",
                whiteSpace: "nowrap",
              }}
            >
              {searchLoading ? (
                <span className="spinner" style={{ borderTopColor: "var(--gold)" }} />
              ) : (
                "Ara"
              )}
            </button>
          </div>
        </div>

        {players.length > 0 && (
          <div className="player-list">
            {players.map((p) => (
              <div key={p.ea_id} className="player-card">
                <div className="player-name">
                  {p.name}
                  {p.is_icon && (
                    <span style={{ marginLeft: 4, fontSize: "0.75rem", color: "var(--gold)" }}>ICON</span>
                  )}
                  {p.is_hero && (
                    <span style={{ marginLeft: 4, fontSize: "0.75rem", color: "#7c4dff" }}>HERO</span>
                  )}
                </div>
                <div>
                  <span className="player-rating">{p.rating}</span>
                  <span className="player-meta" style={{ marginLeft: 6 }}>{p.position}</span>
                </div>
                {p.price > 0 ? (
                  <div className="player-price">{p.price.toLocaleString("tr-TR")} coins</div>
                ) : (
                  <div className="player-meta">Fiyat yok</div>
                )}
                {p.league && <div className="player-meta">{p.league}</div>}
                {p.nation && <div className="player-meta">{p.nation}</div>}
              </div>
            ))}
          </div>
        )}

        {players.length === 0 && playerName && !searchLoading && (
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginBottom: 12 }}>
            Sonuç bulunamadı — ismi tam yaz veya İngilizce dene
          </p>
        )}

        <div className="form-group">
          <label>Market Sorun</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Örn: Mbappe'yi şimdi almalı mıyım? TOTY süreci ne zaman başlar? Hangi oyuncular yatırım için uygun?"
            style={{ minHeight: 100 }}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analiz ediliyor...
            </>
          ) : (
            "Market Tavsiyesi Al"
          )}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      {result && <ResultBox title="Market Analizi" content={result} />}
    </div>
  );
}
