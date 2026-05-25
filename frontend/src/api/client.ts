const API_BASE = "http://localhost:8000/api";

export async function analyzeScreenshot(image: File, question: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("question", question);
  const res = await fetch(`${API_BASE}/analyze`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`);
  const data = await res.json();
  return data.analysis as string;
}

export async function buildSquad(params: {
  budget: number;
  formation?: string;
  league?: string;
  nation?: string;
  play_style?: string;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/squad/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Squad build failed: ${res.statusText}`);
  const data = await res.json();
  return data.recommendation as string;
}

export async function solveSBC(requirements: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${API_BASE}/sbc/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requirements),
  });
  if (!res.ok) throw new Error(`SBC solve failed: ${res.statusText}`);
  const data = await res.json();
  return data.solution as string;
}

export async function getMarketAdvice(question: string, player_name?: string): Promise<string> {
  const res = await fetch(`${API_BASE}/market/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, player_name }),
  });
  if (!res.ok) throw new Error(`Market advice failed: ${res.statusText}`);
  const data = await res.json();
  return data.advice as string;
}

export interface FutPlayer {
  ea_id: number;
  name: string;
  rating: number;
  position: string;
  price: number;
  nation: string;
  league: string;
  club: string;
  is_icon?: boolean;
  is_hero?: boolean;
}

export async function searchPlayer(name: string): Promise<FutPlayer[]> {
  const res = await fetch(`${API_BASE}/market/player/${encodeURIComponent(name)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.players as FutPlayer[]) || [];
}
