from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import analyze, squad, sbc, market

app = FastAPI(title="FUT Arthur Guide API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")
app.include_router(squad.router, prefix="/api")
app.include_router(sbc.router, prefix="/api")
app.include_router(market.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
