import { useState } from "react";
import { solveSBC } from "../api/client";
import ResultBox from "./ResultBox";

export default function SBCSolver() {
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
      setError("En az bir koşul girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    try {
      const solution = await solveSBC(req);
      setResult(solution);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>🧩 SBC Çözücü</h2>

        <div className="form-row">
          <div className="form-group">
            <label>Min. Takım Ratinği</label>
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
            <label>Min. Kimya</label>
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
            <label>Lig</label>
            <input
              type="text"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              placeholder="Premier League"
            />
          </div>

          <div className="form-group">
            <label>Millet</label>
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
            <label>Kulüp</label>
            <input
              type="text"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              placeholder="Manchester City"
            />
          </div>

          <div className="form-group">
            <label>Aynı ligden oyuncu sayısı</label>
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
            <label>Aynı milletten oyuncu sayısı</label>
            <input
              type="number"
              value={playersFromNation}
              onChange={(e) => setPlayersFromNation(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Rare oyuncu sayısı</label>
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
          <label>Ek Gereksinimler</label>
          <textarea
            value={additional}
            onChange={(e) => setAdditional(e.target.value)}
            placeholder="Örn: Bütçe 50.000 coin. Özel kart gerekmiyor."
          />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              SBC çözülüyor...
            </>
          ) : (
            "SBC Çöz"
          )}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      {result && <ResultBox title="SBC Çözümü" content={result} />}
    </div>
  );
}
