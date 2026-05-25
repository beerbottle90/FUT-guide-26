import anthropic
import base64

async_client = anthropic.AsyncAnthropic()


def _extract_text(response: anthropic.types.Message) -> str:
    return next((b.text for b in response.content if b.type == "text"), "")


async def analyze_screenshot(image_data: bytes, media_type: str, question: str = "") -> str:
    image_b64 = base64.standard_b64encode(image_data).decode("utf-8")
    prompt = question if question else "Analyze this FIFA/EA FC Ultimate Team screenshot and provide detailed advice."

    response = await async_client.messages.create(
        model="claude-opus-4-7",
        max_tokens=16000,
        thinking={"type": "adaptive"},
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": (
                            "You are an expert EA FC / FIFA Ultimate Team advisor. "
                            "Analyze the screenshot carefully and provide actionable advice. "
                            f"{prompt}"
                        ),
                    },
                ],
            }
        ],
    )
    return _extract_text(response)


async def get_squad_recommendation(budget: int, preferences: dict) -> str:
    context = f"""
Budget: {budget:,} FUT coins
Formation preference: {preferences.get('formation', '4-3-3')}
League preference: {preferences.get('league', 'Any')}
Nation preference: {preferences.get('nation', 'Any')}
Play style: {preferences.get('play_style', 'Balanced')}
""".strip()

    response = await async_client.messages.create(
        model="claude-opus-4-7",
        max_tokens=16000,
        thinking={"type": "adaptive"},
        messages=[
            {
                "role": "user",
                "content": (
                    "You are an expert EA FC Ultimate Team squad builder. "
                    f"{context}\n\n"
                    "Suggest an optimal squad with specific players, estimated prices, chemistry links, "
                    "and a budget breakdown. Include captain suggestion and key chemistry links."
                ),
            }
        ],
    )
    return _extract_text(response)


async def solve_sbc(requirements: dict) -> str:
    req_lines = "\n".join(f"- {k.replace('_', ' ').title()}: {v}" for k, v in requirements.items() if v)

    response = await async_client.messages.create(
        model="claude-opus-4-7",
        max_tokens=16000,
        thinking={"type": "adaptive"},
        messages=[
            {
                "role": "user",
                "content": (
                    "You are an expert EA FC SBC (Squad Building Challenge) solver. "
                    f"SBC Requirements:\n{req_lines}\n\n"
                    "Find the most cost-effective solution. List specific player suggestions for each position, "
                    "explain why they meet the requirements, and estimate the total cost in FUT coins."
                ),
            }
        ],
    )
    return _extract_text(response)


async def get_market_advice(question: str, player_data: list = None) -> str:
    player_context = ""
    if player_data:
        lines = []
        for p in player_data[:6]:
            price_str = f"{p['price']:,} coins" if p.get("price") else "fiyat yok"
            lines.append(
                f"- {p['name']} ({p.get('position', '?')}, {p.get('rating', '?')} OVR) "
                f"| {p.get('league', '')} | {p.get('nation', '')} | Güncel fiyat: {price_str}"
            )
        player_context = "\n\nfut.gg'den anlık oyuncu verisi:\n" + "\n".join(lines)

    response = await async_client.messages.create(
        model="claude-opus-4-7",
        max_tokens=16000,
        thinking={"type": "adaptive"},
        messages=[
            {
                "role": "user",
                "content": (
                    "You are an expert EA FC Ultimate Team market analyst and trader. "
                    "You have deep knowledge of FUT player prices, market trends, investment strategies, "
                    "promo events (TOTY, TOTS, Flashback, etc.) and trading techniques. "
                    f"Question: {question}{player_context}\n\n"
                    "Provide detailed market advice including buy/sell timing, price trends, "
                    "investment opportunities, and risk assessment. "
                    "If live price data is provided above, use it as the primary source."
                ),
            }
        ],
    )
    return _extract_text(response)
