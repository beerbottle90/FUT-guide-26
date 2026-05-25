const API_BASE = "http://localhost:8000/api";

async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000); // 2 min timeout
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error).name === "AbortError") {
      throw new Error("Backend yanıt vermedi (timeout). Backend çalışıyor mu?");
    }
    throw new Error("Backend'e bağlanılamıyor. http://localhost:8000 açık mı?");
  }
}

export async function analyzeScreenshot(image: File, question: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("question", question);
  const res = await apiFetch(`${API_BASE}/analyze`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
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
  const res = await apiFetch(`${API_BASE}/squad/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
  const data = await res.json();
  return data.recommendation as string;
}

export async function solveSBC(requirements: Record<string, unknown>): Promise<string> {
  const res = await apiFetch(`${API_BASE}/sbc/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requirements),
  });
  if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
  const data = await res.json();
  return data.solution as string;
}

export async function getMarketAdvice(question: string, player_name?: string): Promise<string> {
  const res = await apiFetch(`${API_BASE}/market/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, player_name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Sunucu hatası: ${res.status}`);
  }
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
  try {
    const res = await apiFetch(`${API_BASE}/market/player/${encodeURIComponent(name)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.players as FutPlayer[]) || [];
  } catch {
    return [];
  }
}
