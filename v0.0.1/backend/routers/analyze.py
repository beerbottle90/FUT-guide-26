from fastapi import APIRouter, File, UploadFile, Form, HTTPException

from services.claude_ai import analyze_screenshot

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}


@router.post("/analyze")
async def analyze_fut_screenshot(
    image: UploadFile = File(...),
    question: str = Form(default=""),
):
    media_type = image.content_type or "image/jpeg"
    if media_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported image type: {media_type}")

    image_data = await image.read()
    if len(image_data) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 20 MB)")

    result = await analyze_screenshot(image_data, media_type, question)
    return {"analysis": result}
