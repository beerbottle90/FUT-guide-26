"""fut.gg API service — player prices and metaratings for EA FC 26."""
from typing import Optional
from curl_cffi.requests import AsyncSession

FUTGG_BASE = "https://www.fut.gg/api/fut"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
    "Referer": "https://www.fut.gg/",
}


async def _get(url: str, params: dict = None) -> Optional[dict]:
    async with AsyncSession(impersonate="chrome120") as session:
        try:
            resp = await session.get(url, headers=_HEADERS, params=params or {}, timeout=15)
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return None


def _parse_player(p: dict) -> dict:
    nation = p.get("nation") or {}
    league = p.get("league") or {}
    club = p.get("club") or p.get("uniqueClub") or {}
    name = p.get("commonName") or f"{p.get('firstName', '')} {p.get('lastName', '')}".strip()
    return {
        "ea_id": p.get("eaId", 0),
        "name": name,
        "rating": p.get("overall", 0),      # fut.gg uses "overall", not "rating"
        "position": p.get("position", ""),
        "price": p.get("price", 0) or p.get("currentDbPrice", 0),
        "nation": nation.get("name", ""),
        "league": league.get("name", ""),
        "club": club.get("name", ""),
        "is_icon": p.get("isIcon", False),
        "is_hero": p.get("isHero", False),
    }


async def search_players(name: str, limit: int = 8) -> list:
    """
    Search players by name.
    fut.gg /players/v2/26/ doesn't support text search — we fetch page 1
    and filter the 30 results by name. Works well for popular players.
    """
    data = await _get(f"{FUTGG_BASE}/players/v2/26/", {"page": 1})
    if not data:
        return []

    items = data.get("data") or data.get("items") or []
    name_lower = name.lower()

    # Filter matching players first, then fill with remaining sorted by price
    matching = [p for p in items if name_lower in (p.get("commonName") or "").lower()
                or name_lower in (p.get("lastName") or "").lower()
                or name_lower in (p.get("firstName") or "").lower()]

    if not matching:
        # Return top players by price if no match found
        matching = sorted(items, key=lambda p: p.get("price", 0), reverse=True)

    return [_parse_player(p) for p in matching[:limit]]


async def get_metarating(ea_id: int) -> dict:
    """Get metaratings per role/position for a single player."""
    data = await _get(f"{FUTGG_BASE}/metarank/player/{ea_id}/")
    if not data or "data" not in data:
        return {}

    scores = data["data"].get("scores", [])
    best: dict = {}
    for item in scores:
        role = item.get("role")
        score = item.get("score")
        if role is None or score is None:
            continue
        role_key = str(role)
        if role_key not in best or score > best[role_key]["score"]:
            best[role_key] = {"score": float(score)}
    return best


async def get_top_players(page: int = 1) -> list:
    """Fetch a page of top players from fut.gg sorted by price."""
    data = await _get(f"{FUTGG_BASE}/players/v2/26/", {"page": page})
    if not data:
        return []

    items = data.get("data") or data.get("items") or []
    return [_parse_player(p) for p in items]
