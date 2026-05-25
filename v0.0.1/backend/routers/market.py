from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.claude_ai import get_market_advice
from services.futgg import search_players, get_top_players

router = APIRouter()


class MarketRequest(BaseModel):
    question: str
    player_name: Optional[str] = None


@router.post("/market/advice")
async def get_advice(request: MarketRequest):
    player_data = []
    if request.player_name:
        player_data = await search_players(request.player_name)

    result = await get_market_advice(request.question, player_data)
    return {"advice": result}


@router.get("/market/player/{player_name}")
async def get_player_prices(player_name: str):
    players = await search_players(player_name)
    return {"players": players}


@router.get("/market/top")
async def get_top(page: int = 1):
    players = await get_top_players(page)
    return {"players": players}
