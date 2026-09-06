import re
from typing import Dict, Any, List

SUSPICIOUS_PATTERNS = [
    (r"(fee|charge|deposit|advance|processing fee|tax).*?(release|transfer|claim|unclaimed|disburse)", "Advance fee demand to release funds"),
    (r"(urgent|immediate|within 24 hours|expire|forfeit|penalty)", "Artificial urgency or penalty pressure"),
    (r"(guaranteed|100%|sure shot|immediate payout|direct bank transfer without kyc)", "Unrealistic guarantee of disbursement"),
    (r"(whatsapp|telegram|personal number|\+91\s?[6-9]\d{9}|gmail\.com|yahoo\.com)", "Unverified personal contact or non-official email"),
    (r"(bit\.ly|tinyurl|is\.gd|cutt\.ly|ngrok|web\.app)", "Suspicious shortened link or unofficial domain"),
    (r"(rbi agent|iepfa officer|claim manager|recovery representative)", "Impersonation of regulatory or institutional officials"),
]

def evaluate_scam_threat(content: str, input_type: str = "text") -> Dict[str, Any]:
    content_lower = content.lower()
    flags_detected: List[str] = []
    risk_score = 15 # baseline curiosity

    for pattern, description in SUSPICIOUS_PATTERNS:
        if re.search(pattern, content_lower, re.IGNORECASE):
            flags_detected.append(description)
            risk_score += 25

    # Check for legitimate official domains
    official_domains = ["rbi.org.in", "iepf.gov.in", "epfindia.gov.in", "irdai.gov.in", "mca.gov.in", "gov.in", "nic.in"]
    has_official_domain = any(domain in content_lower for domain in official_domains)

    if has_official_domain and len(flags_detected) == 0:
        risk_level = "SAFE"
        risk_score = 5
        explanation = "The referenced communication mentions official government/regulatory domains (.gov.in / .org.in)."
        comparison = "Official authorities (RBI, IEPFA, EPFO, IRDAI) never demand upfront fees via personal accounts or chat apps."
        next_action = "You may safely verify the claim through the official institutional portal."
    elif risk_score >= 60:
        risk_level = "HIGH RISK"
        risk_score = min(risk_score, 98)
        explanation = (
            "This communication exhibits hallmarks of an unclaimed-asset recovery scam. "
            "It pressures you for advance payment or directs you away from official public portals."
        )
        comparison = (
            "CRITICAL WARNING: Genuine statutory bodies (such as RBI, IEPF Authority, or EPFO) "
            "NEVER charge an upfront fee to release your rightful money. All claims are filed directly through official channels."
        )
        next_action = "DO NOT send money or share OTPs. Block the sender and report to the National Cyber Crime Portal (cybercrime.gov.in)."
    elif risk_score >= 35:
        risk_level = "MODERATE RISK"
        explanation = "The communication contains elements that warrant caution, such as unsolicited contact or urgency."
        comparison = "Authorized recovery processes do not bypass statutory KYC procedures."
        next_action = "Verify the record directly inside ADHIKAAR or the institution's official website."
    else:
        risk_level = "LOW RISK"
        explanation = "No overt advance-fee or phishing patterns were detected in the supplied text."
        comparison = "Always confirm any reference numbers against your official records."
        next_action = "Cross-check the institutional reference in your ADHIKAAR dashboard."

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "detected_flags": flags_detected,
        "plain_language_explanation": explanation,
        "official_comparison": comparison,
        "safe_next_action": next_action
    }
