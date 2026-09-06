from typing import Dict, Any, List

RAG_KNOWLEDGE_BASE = [
    {
        "keywords": ["udgam", "bank", "deposit", "savings", "fixed deposit", "fd", "rbi"],
        "category": "bank",
        "answer": (
            "Under RBI regulations, bank deposits inactive for 10 or more years are transferred to the DEA "
            "(Depositor Education and Awareness) Fund. You can reclaim these directly from the concerned bank "
            "by submitting KYC documents (Aadhaar, PAN, Address proof) and an Unclaimed Deposit Claim Form. "
            "No fees or intermediaries are required."
        ),
        "actions": ["Start Bank Recovery", "Check Document Checklist", "Download Claim Form Draft"]
    },
    {
        "keywords": ["iepf", "shares", "dividend", "dividends", "mca", "mca21", "form 5"],
        "category": "investments",
        "answer": (
            "Shares and unpaid dividends unclaimed for 7 consecutive years are transferred to the IEPF Authority "
            "(Ministry of Corporate Affairs). To recover, the claimant must file online web-form IEPF-5 on the MCA portal, "
            "then submit the physical indemnity bond, original share certificates or demat statement, and Aadhaar/PAN to the company's Nodal Officer."
        ),
        "actions": ["Draft IEPF-5 Checklist", "View Required Indemnity Bond", "Check Company Nodal Officer"]
    },
    {
        "keywords": ["pf", "epf", "epfo", "provident fund", "uan", "inoperative"],
        "category": "pf",
        "answer": (
            "An EPF account becomes inoperative if no contributions are received for 36 months after retirement or job change. "
            "To withdraw or transfer, log in to the EPFO Unified Member Portal using your UAN. If UAN is forgotten, ADHIKAAR "
            "helps you match historical employer names and member IDs so you can initiate a Member Helpdesk claim."
        ),
        "actions": ["Find Member ID", "View EPFO Transfer Guide", "Prepare Joint Declaration"]
    },
    {
        "keywords": ["insurance", "policy", "lic", "premium", "maturity", "bima bharosa", "irdai"],
        "category": "insurance",
        "answer": (
            "Unclaimed life or general insurance policy amounts (unpaid maturity, death claims, excess premium) are held by insurers "
            "under IRDAI Bima Bharosa regulations. After 10 years, they transfer to Senior Citizens' Welfare Fund (SCWF) but remain claimable. "
            "You require the original policy bond (or indemnity bond for lost policy) and bank cancelled cheque."
        ),
        "actions": ["View Insurer Claim Form", "Check Policy Bond Checklist", "Track Insurance Status"]
    },
    {
        "keywords": ["name", "mismatch", "spelling", "variation", "fatima", "fathima", "initial"],
        "category": "identity",
        "answer": (
            "Name variations between historical institutional records and modern Aadhaar/PAN (such as 'Lubna Fathima' vs 'Lubna Fatima' or initials) "
            "are common. Institutional authorities accept: (1) Self-declaration affidavit for minor spelling differences, "
            "(2) One-and-the-same certificate from an Executive Magistrate, or (3) Gazette notification for major name changes."
        ),
        "actions": ["Generate Self-Declaration Affidavit", "View Gazette Guide", "Upload Address Proof"]
    },
    {
        "keywords": ["ready", "readiness", "score", "percentage", "claim readiness"],
        "category": "readiness",
        "answer": (
            "The Claim Readiness Score measures how prepared your case is for successful official submission. "
            "It checks: Identity alignment (30%), Asset record verification (25%), Mandatory KYC documents (25%), "
            "and Institutional Claim Form completion (20%). Achieving 80%+ minimizes rejection risk."
        ),
        "actions": ["View Missing Documents", "Upload Required Proof", "Launch Application Drafter"]
    },
    {
        "keywords": ["how", "upload", "page", "navigate", "portal", "button", "help", "where"],
        "category": "portal",
        "answer": (
            "ADHIKAAR provides 4 primary operational zones: (1) 'Discover' to search across 6 institutional networks, "
            "(2) 'Results' to review potential matches and evidence, (3) 'Documents' to scan and extract KYC proofs, "
            "and (4) 'Claims' to draft applications and track official status timelines."
        ),
        "actions": ["Go to Discover", "Go to Documents", "Go to Scam Shield"]
    }
]

def generate_copilot_response(
    query: str,
    mode: str = "recovery",
    current_page: str = "",
    asset_id: int = None
) -> Dict[str, Any]:
    query_lower = query.lower()
    
    # Match keywords in knowledge base
    best_match = None
    best_score = 0
    for item in RAG_KNOWLEDGE_BASE:
        score = sum(1 for kw in item["keywords"] if kw in query_lower)
        if score > best_score:
            best_score = score
            best_match = item

    if best_match and best_score > 0:
        reply = best_match["answer"]
        actions = best_match["actions"]
    else:
        if mode == "recovery":
            reply = (
                "I am your ADHIKAAR Recovery Copilot. I analyze regulatory rules across RBI UDGAM, IEPFA, EPFO, and IRDAI. "
                "I can explain why a potential match was found, identify missing KYC documents, and help you draft official claim packets."
            )
            actions = ["Search Forgotten Assets", "Check Name Discrepancy Rules", "Analyze Recovery Scam"]
        else:
            reply = (
                "I am your ADHIKAAR Portal Copilot. I can guide you step-by-step through our living discovery ecosystem, "
                "explain privacy consent settings, or help you upload documents for automated mismatch analysis."
            )
            actions = ["Take Interactive Tour", "Manage Consent", "Check Security Settings"]

    return {
        "reply": reply,
        "suggested_actions": actions,
        "relevant_tools": ["search_orchestrator", "document_ocr", "claim_drafter", "scam_shield"]
    }
