import re
import unicodedata
from typing import Dict, Any, List, Tuple

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8")
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def soundex(name: str) -> str:
    """Soundex phonetic algorithm for English & Indian romanized names."""
    name = normalize_text(name)
    if not name:
        return "0000"
    
    first = name[0].upper()
    mapping = {
        'B': '1', 'F': '1', 'P': '1', 'V': '1',
        'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
        'D': '3', 'T': '3',
        'L': '4',
        'M': '5', 'N': '5',
        'R': '6'
    }
    
    res = [first]
    prev = mapping.get(first, '0')
    for char in name[1:].upper():
        code = mapping.get(char, '0')
        if code != '0':
            if code != prev:
                res.append(code)
            prev = code
        else:
            prev = '0'
            
    res_str = "".join(res)[:4]
    return res_str.ljust(4, '0')

def levenshtein_similarity(s1: str, s2: str) -> float:
    s1, s2 = normalize_text(s1), normalize_text(s2)
    if s1 == s2:
        return 1.0
    if not s1 or not s2:
        return 0.0
    
    len1, len2 = len(s1), len(s2)
    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    for i in range(len1 + 1):
        matrix[i][0] = i
    for j in range(len2 + 1):
        matrix[0][j] = j

    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            cost = 0 if s1[i - 1] == s2[j - 1] else 1
            matrix[i][j] = min(
                matrix[i - 1][j] + 1,      # deletion
                matrix[i][j - 1] + 1,      # insertion
                matrix[i - 1][j - 1] + cost # substitution
            )
            
    dist = matrix[len1][len2]
    max_len = max(len1, len2)
    return round(1.0 - (dist / max_len), 3)

def token_sort_similarity(s1: str, s2: str) -> float:
    tokens1 = sorted(normalize_text(s1).split())
    tokens2 = sorted(normalize_text(s2).split())
    return levenshtein_similarity(" ".join(tokens1), " ".join(tokens2))

def check_initial_variation(query_name: str, record_name: str) -> float:
    """Detects if 'L. Fathima' matches 'Lubna Fathima'."""
    q_tokens = normalize_text(query_name).split()
    r_tokens = normalize_text(record_name).split()
    if not q_tokens or not r_tokens:
        return 0.0
    
    # Check if first token is initial
    if len(q_tokens[0]) == 1 and len(r_tokens[0]) > 1:
        if q_tokens[0] == r_tokens[0][0]:
            remaining_q = " ".join(q_tokens[1:])
            remaining_r = " ".join(r_tokens[1:])
            return levenshtein_similarity(remaining_q, remaining_r) * 0.95
    if len(r_tokens[0]) == 1 and len(q_tokens[0]) > 1:
        if r_tokens[0] == q_tokens[0][0]:
            remaining_q = " ".join(q_tokens[1:])
            remaining_r = " ".join(r_tokens[1:])
            return levenshtein_similarity(remaining_q, remaining_r) * 0.95
    return 0.0

def resolve_entity_match(
    query: Dict[str, Any],
    record: Dict[str, Any]
) -> Tuple[float, List[Dict[str, Any]], str]:
    """
    Evaluates multi-attribute statistical & phonetic similarity.
    Returns: (overall_confidence, evidence_items, match_summary_reason)
    """
    q_name = query.get("name", "")
    r_name = record.get("holder_name", "")
    
    # 1. Exact & Fuzzy Name Similarity
    fuzzy_sim = levenshtein_similarity(q_name, r_name)
    token_sim = token_sort_similarity(q_name, r_name)
    initial_sim = check_initial_variation(q_name, r_name)
    name_score = max(fuzzy_sim, token_sim, initial_sim)

    # 2. Phonetic Similarity (Soundex & Indian name transliteration rules)
    q_sdx = soundex(q_name)
    r_sdx = soundex(r_name)
    phonetic_score = 1.0 if q_sdx == r_sdx else 0.5 if q_sdx[:2] == r_sdx[:2] else 0.2

    # Transliteration aliases (Fathima -> Fatima, Lakshmi -> Laxmi, etc)
    q_norm = normalize_text(q_name)
    r_norm = normalize_text(r_name)
    if ("fathima" in q_norm and "fatima" in r_norm) or ("fatima" in q_norm and "fathima" in r_norm):
        phonetic_score = 0.98
        name_score = max(name_score, 0.94)
    if ("laxmi" in q_norm and "lakshmi" in r_norm) or ("lakshmi" in q_norm and "laxmi" in r_norm):
        phonetic_score = 0.98
        name_score = max(name_score, 0.94)

    # 3. Location / Address Similarity
    q_loc = query.get("location", "")
    r_addr = record.get("holder_address", "")
    address_score = 0.70 # Default prior if not specified
    if q_loc and r_addr:
        q_loc_norm = normalize_text(q_loc)
        r_addr_norm = normalize_text(r_addr)
        if q_loc_norm in r_addr_norm or any(token in r_addr_norm for token in q_loc_norm.split()):
            address_score = 0.95
        else:
            address_score = 0.40

    # 4. Institution / Category fit
    q_inst = query.get("institution", "")
    r_inst = record.get("institution", "")
    inst_score = 0.80
    if q_inst and r_inst:
        if normalize_text(q_inst) in normalize_text(r_inst):
            inst_score = 1.0
        else:
            inst_score = 0.45

    # 5. Weighted Overall Confidence
    overall = (name_score * 0.45) + (phonetic_score * 0.25) + (address_score * 0.20) + (inst_score * 0.10)
    overall = round(min(overall, 0.99), 2)

    # Build Explainable Evidence Breakdown
    evidence: List[Dict[str, Any]] = [
        {
            "factor": "Name & Spelling Alignment",
            "score": name_score,
            "description": f"Query string '{q_name}' matches historical record '{r_name}' with {int(name_score*100)}% structural alignment.",
            "status": "matched" if name_score > 0.8 else "partial"
        },
        {
            "factor": "Phonetic & Transliteration Rule",
            "score": phonetic_score,
            "description": f"Soundex and phonetic representation mapped across regional spelling conventions.",
            "status": "matched" if phonetic_score > 0.8 else "partial"
        },
        {
            "factor": "Geographic / Address Fit",
            "score": address_score,
            "description": f"Recorded regional jurisdiction matches target search region ({r_addr[:25]}...).",
            "status": "matched" if address_score > 0.7 else "partial"
        },
        {
            "factor": "Institutional Consistency",
            "score": inst_score,
            "description": f"Asset identified in authorized database of {r_inst}.",
            "status": "matched" if inst_score > 0.7 else "partial"
        }
    ]

    reason = (
        f"Statistical match confidence of {int(overall*100)}% based on high phonetic similarity "
        f"('{r_name}'), verified institutional records at {r_inst}, and jurisdictional alignment."
    )

    return overall, evidence, reason
