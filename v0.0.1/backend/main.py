import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

from routers import analyze, squad, sbc, market

app = FastAPI(title="FUT Arthur Guide API", version="1.0.0")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    return JSONResponse(status_code=500, content={"error": str(exc), "trace": tb[-800:]})

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
