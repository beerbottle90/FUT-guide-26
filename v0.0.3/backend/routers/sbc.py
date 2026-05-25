from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.claude_ai import solve_sbc

router = APIRouter()


class SBCRequest(BaseModel):
    min_team_rating: Optional[int] = None
    min_chemistry: Optional[int] = None
    league: Optional[str] = None
    nation: Optional[str] = None
    club: Optional[str] = None
    players_from_league: Optional[int] = None
    players_from_nation: Optional[int] = None
    rare_players: Optional[int] = None
    special_cards: Optional[int] = None
    additional_requirements: Optional[str] = None


@router.post("/sbc/solve")
async def solve_sbc_challenge(request: SBCRequest):
    requirements = {k: v for k, v in request.model_dump().items() if v is not None}
    result = await solve_sbc(requirements)
    return {"solution": result}
