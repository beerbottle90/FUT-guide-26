from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional

from services.claude_ai import get_squad_recommendation

router = APIRouter()


class SquadRequest(BaseModel):
    budget: int = Field(..., ge=1000, le=200_000_000)
    formation: Optional[str] = "4-3-3"
    league: Optional[str] = ""
    nation: Optional[str] = ""
    play_style: Optional[str] = "Balanced"


@router.post("/squad/build")
async def build_squad(request: SquadRequest):
    preferences = {
        "formation": request.formation,
        "league": request.league,
        "nation": request.nation,
        "play_style": request.play_style,
    }
    result = await get_squad_recommendation(request.budget, preferences)
    return {"recommendation": result}
