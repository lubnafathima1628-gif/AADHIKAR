from typing import Dict, Any, List
from backend.app.connectors.base import BaseConnector
from backend.app.ai.entity_resolution import resolve_entity_match

class BankAdapter(BaseConnector):
    def __init__(self):
        super().__init__(
            code="RBI_UDGAM",
            name="RBI UDGAM (Unclaimed Deposits Gateway to Access inforMation)",
            category="bank",
            authority="Reserve Bank of India & Participating Scheduled Commercial Banks",
            portal_url="https://udgam.rbi.org.in"
        )

    def search(self, query: Dict[str, Any], records_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for rec in records_pool:
            if rec.get("category") == "bank":
                conf, evidence, reason = resolve_entity_match(query, rec)
                if conf >= 0.65:
                    results.append({**rec, "match_confidence": conf, "evidence": evidence, "match_reason": reason, "source_meta": self.get_source_metadata()})
        return results

class InsuranceAdapter(BaseConnector):
    def __init__(self):
        super().__init__(
            code="IRDAI_BIMA",
            name="IRDAI Bima Bharosa Unclaimed Policy Register",
            category="insurance",
            authority="Insurance Regulatory and Development Authority of India",
            portal_url="https://bimabharosa.irdai.gov.in"
        )

    def search(self, query: Dict[str, Any], records_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for rec in records_pool:
            if rec.get("category") == "insurance":
                conf, evidence, reason = resolve_entity_match(query, rec)
                if conf >= 0.65:
                    results.append({**rec, "match_confidence": conf, "evidence": evidence, "match_reason": reason, "source_meta": self.get_source_metadata()})
        return results

class IEPFAdapter(BaseConnector):
    def __init__(self):
        super().__init__(
            code="MCA_IEPF",
            name="IEPF Authority (Unclaimed Shares & Unpaid Dividends)",
            category="investments",
            authority="Ministry of Corporate Affairs, Government of India",
            portal_url="https://www.iepf.gov.in"
        )

    def search(self, query: Dict[str, Any], records_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for rec in records_pool:
            if rec.get("category") == "investments":
                conf, evidence, reason = resolve_entity_match(query, rec)
                if conf >= 0.65:
                    results.append({**rec, "match_confidence": conf, "evidence": evidence, "match_reason": reason, "source_meta": self.get_source_metadata()})
        return results

class EPFOAdapter(BaseConnector):
    def __init__(self):
        super().__init__(
            code="MOL_EPFO",
            name="EPFO Inoperative Member Account Portal",
            category="pf",
            authority="Employees' Provident Fund Organisation (Ministry of Labour & Employment)",
            portal_url="https://unifiedportal-mem.epfindia.gov.in"
        )

    def search(self, query: Dict[str, Any], records_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for rec in records_pool:
            if rec.get("category") == "pf":
                conf, evidence, reason = resolve_entity_match(query, rec)
                if conf >= 0.65:
                    results.append({**rec, "match_confidence": conf, "evidence": evidence, "match_reason": reason, "source_meta": self.get_source_metadata()})
        return results

class PropertyAdapter(BaseConnector):
    def __init__(self):
        super().__init__(
            code="STATE_LAND",
            name="Unified State Revenue & Land Record Gateway",
            category="property",
            authority="State Department of Revenue & Land Administration",
            portal_url="https://landrecords.gov.in"
        )

    def search(self, query: Dict[str, Any], records_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for rec in records_pool:
            if rec.get("category") == "property":
                conf, evidence, reason = resolve_entity_match(query, rec)
                if conf >= 0.65:
                    results.append({**rec, "match_confidence": conf, "evidence": evidence, "match_reason": reason, "source_meta": self.get_source_metadata()})
        return results

class BenefitsAdapter(BaseConnector):
    def __init__(self):
        super().__init__(
            code="GOV_DBT",
            name="Direct Benefit Transfer & Welfare Registry",
            category="benefits",
            authority="Cabinet Secretariat & Ministry of Social Justice",
            portal_url="https://dbtbharat.gov.in"
        )

    def search(self, query: Dict[str, Any], records_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for rec in records_pool:
            if rec.get("category") == "benefits":
                conf, evidence, reason = resolve_entity_match(query, rec)
                if conf >= 0.65:
                    results.append({**rec, "match_confidence": conf, "evidence": evidence, "match_reason": reason, "source_meta": self.get_source_metadata()})
        return results

CONNECTOR_REGISTRY = {
    "bank": BankAdapter(),
    "insurance": InsuranceAdapter(),
    "investments": IEPFAdapter(),
    "pf": EPFOAdapter(),
    "property": PropertyAdapter(),
    "benefits": BenefitsAdapter(),
}
