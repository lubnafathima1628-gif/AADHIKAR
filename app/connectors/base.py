from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseConnector(ABC):
    def __init__(self, code: str, name: str, category: str, authority: str, portal_url: str):
        self.code = code
        self.name = name
        self.category = category
        self.authority = authority
        self.portal_url = portal_url
        self.health_status = "healthy"
        self.latency_ms = 95

    @abstractmethod
    def search(self, query: Dict[str, Any], records_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Search across simulated or real authorized endpoints."""
        pass

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "code": self.code,
            "name": self.name,
            "category": self.category,
            "authority": self.authority,
            "health_status": self.health_status,
            "latency_ms": self.latency_ms,
            "official_portal_url": self.portal_url
        }
