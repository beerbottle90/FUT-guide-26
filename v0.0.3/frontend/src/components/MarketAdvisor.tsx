import { useState } from "react";
import { getMarketAdvice, searchPlayer, FutPlayer } from "../api/client";
import ResultBox from "./ResultBox";
import { useLang } from "../context/LangContext";

export default function MarketAdvisor() {
  const { t, lang } = useLang();
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
      setError(t("market_question_error"));
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const advice = await getMarketAdvice(question, playerName || undefined);
      setResult(advice);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error_generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>{t("market_title")}</h2>

        <div className="form-group">
          <label>{t("market_player_label")}</label>
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
              className="btn-search"
              onClick={handlePlayerSearch}
              disabled={searchLoading || !playerName.trim()}
            >
              {searchLoading ? (
                <span className="spinner" style={{ borderTopColor: "var(--gold)" }} />
              ) : (
                t("market_search_btn")
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
                  <div className="player-price">
                    {p.price.toLocaleString(lang === "tr" ? "tr-TR" : "en-GB")} coins
                  </div>
                ) : (
                  <div className="player-meta">{t("market_no_price")}</div>
                )}
                {p.league && <div className="player-meta">{p.league}</div>}
                {p.nation && <div className="player-meta">{p.nation}</div>}
              </div>
            ))}
          </div>
        )}

        {players.length === 0 && playerName && !searchLoading && (
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", marginBottom: 12 }}>
            {t("market_no_results")}
          </p>
        )}

        <div className="form-group">
          <label>{t("market_question_label")}</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t("market_question_placeholder")}
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
              {t("market_loading")}
            </>
          ) : (
            t("market_btn")
          )}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      {result && <ResultBox title={t("market_result_title")} content={result} />}
    </div>
  );
}
