import { useState } from "react";
import { buildSquad } from "../api/client";
import ResultBox from "./ResultBox";
import { useLang } from "../context/LangContext";

const FORMATIONS = ["4-3-3", "4-4-2", "4-2-3-1", "3-4-3", "3-5-2", "5-3-2", "4-1-2-1-2", "4-5-1"];
const PLAY_STYLES = ["Balanced", "Attack", "Defense", "Possession", "Counter-Attack"];

export default function SquadBuilder() {
  const { t } = useLang();
  const [budget, setBudget] = useState("100000");
  const [formation, setFormation] = useState("4-3-3");
  const [league, setLeague] = useState("");
  const [nation, setNation] = useState("");
  const [playStyle, setPlayStyle] = useState("Balanced");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const budgetNum = parseInt(budget, 10);
    if (!budgetNum || budgetNum < 1000) {
      setError(t("squad_budget_error"));
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const rec = await buildSquad({
        budget: budgetNum,
        formation,
        league,
        nation,
        play_style: playStyle,
      });
      setResult(rec);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error_generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>{t("squad_title")}</h2>

        <div className="form-group">
          <label>{t("squad_budget_label")}</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="100000"
            min="1000"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t("squad_formation_label")}</label>
            <select value={formation} onChange={(e) => setFormation(e.target.value)}>
              {FORMATIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t("squad_playstyle_label")}</label>
            <select value={playStyle} onChange={(e) => setPlayStyle(e.target.value)}>
              {PLAY_STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t("squad_league_label")}</label>
            <input
              type="text"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              placeholder="Premier League, LaLiga..."
            />
          </div>

          <div className="form-group">
            <label>{t("squad_nation_label")}</label>
            <input
              type="text"
              value={nation}
              onChange={(e) => setNation(e.target.value)}
              placeholder="Turkey, Spain, Brazil..."
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              {t("squad_loading")}
            </>
          ) : (
            t("squad_btn")
          )}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      {result && <ResultBox title={t("squad_result_title")} content={result} />}
    </div>
  );
}
