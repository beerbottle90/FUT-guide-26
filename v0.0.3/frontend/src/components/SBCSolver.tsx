import { useState } from "react";
import { solveSBC } from "../api/client";
import ResultBox from "./ResultBox";
import { useLang } from "../context/LangContext";

export default function SBCSolver() {
  const { t } = useLang();
  const [minRating, setMinRating] = useState("");
  const [minChemistry, setMinChemistry] = useState("");
  const [league, setLeague] = useState("");
  const [nation, setNation] = useState("");
  const [club, setClub] = useState("");
  const [playersFromLeague, setPlayersFromLeague] = useState("");
  const [playersFromNation, setPlayersFromNation] = useState("");
  const [rarePlayers, setRarePlayers] = useState("");
  const [additional, setAdditional] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const req: Record<string, unknown> = {};
    if (minRating) req.min_team_rating = parseInt(minRating);
    if (minChemistry) req.min_chemistry = parseInt(minChemistry);
    if (league) req.league = league;
    if (nation) req.nation = nation;
    if (club) req.club = club;
    if (playersFromLeague) req.players_from_league = parseInt(playersFromLeague);
    if (playersFromNation) req.players_from_nation = parseInt(playersFromNation);
    if (rarePlayers) req.rare_players = parseInt(rarePlayers);
    if (additional) req.additional_requirements = additional;

    if (Object.keys(req).length === 0) {
      setError(t("sbc_empty_error"));
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    try {
      const solution = await solveSBC(req);
      setResult(solution);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error_generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>{t("sbc_title")}</h2>

        <div className="form-row">
          <div className="form-group">
            <label>{t("sbc_min_rating_label")}</label>
            <input
              type="number"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="85"
              min="1"
              max="99"
            />
          </div>

          <div className="form-group">
            <label>{t("sbc_min_chem_label")}</label>
            <input
              type="number"
              value={minChemistry}
              onChange={(e) => setMinChemistry(e.target.value)}
              placeholder="22"
              min="0"
              max="33"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t("sbc_league_label")}</label>
            <input
              type="text"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              placeholder="Premier League"
            />
          </div>

          <div className="form-group">
            <label>{t("sbc_nation_label")}</label>
            <input
              type="text"
              value={nation}
              onChange={(e) => setNation(e.target.value)}
              placeholder="Turkey"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t("sbc_club_label")}</label>
            <input
              type="text"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              placeholder="Manchester City"
            />
          </div>

          <div className="form-group">
            <label>{t("sbc_players_league_label")}</label>
            <input
              type="number"
              value={playersFromLeague}
              onChange={(e) => setPlayersFromLeague(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t("sbc_players_nation_label")}</label>
            <input
              type="number"
              value={playersFromNation}
              onChange={(e) => setPlayersFromNation(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>{t("sbc_rare_label")}</label>
            <input
              type="number"
              value={rarePlayers}
              onChange={(e) => setRarePlayers(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>{t("sbc_additional_label")}</label>
          <textarea
            value={additional}
            onChange={(e) => setAdditional(e.target.value)}
            placeholder={t("sbc_additional_placeholder")}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              {t("sbc_loading")}
            </>
          ) : (
            t("sbc_btn")
          )}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      {result && <ResultBox title={t("sbc_result_title")} content={result} />}
    </div>
  );
}
