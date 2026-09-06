from fastapi import APIRouter, Depends
from backend.app.schemas.schemas import ChatRequest, ChatResponse
from backend.app.ai.rag_copilot import generate_copilot_response

router = APIRouter(prefix="/chat", tags=["AI Copilot"])

@router.post("", response_model=ChatResponse)
def handle_chat_message(req: ChatRequest):
    last_user_message = ""
    for m in reversed(req.messages):
        if m.role == "user":
            last_user_message = m.content
            break
    
    result = generate_copilot_response(
        query=last_user_message,
        mode=req.mode,
        current_page=req.current_page or "",
        asset_id=req.asset_context_id
    )

    return ChatResponse(
        reply=result["reply"],
        suggested_actions=result["suggested_actions"],
        relevant_tools=result["relevant_tools"]
    )
