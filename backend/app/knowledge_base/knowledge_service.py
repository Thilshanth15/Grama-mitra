"""
Knowledge Service — RAG Knowledge Base Retrieval Engine for Grama Mitra
Provides keyword matching, semantic relevance scoring, and category filtering
over verified Tamil & English knowledge records.
"""
import json
import logging
from pathlib import Path
from typing import List, Dict, Optional, Any

logger = logging.getLogger("grama_mitra.knowledge")

DATA_FILE = Path(__file__).resolve().parent / "knowledge_data.json"


class KnowledgeService:
    def __init__(self, data_path: Path = DATA_FILE):
        self.records: List[Dict[str, Any]] = []
        self.load_data(data_path)

    def load_data(self, path: Path):
        """Load knowledge base records from JSON file."""
        if not path.exists():
            logger.warning(f"Knowledge data file not found at {path}")
            self.records = []
            return

        try:
            with open(path, "r", encoding="utf-8") as f:
                self.records = json.load(f)
            logger.info(f"Successfully loaded {len(self.records)} knowledge records.")
        except Exception as e:
            logger.error(f"Failed to load knowledge records from {path}: {e}", exc_info=True)
            self.records = []

    def count(self) -> int:
        """Returns total number of loaded knowledge records."""
        return len(self.records)

    def search_knowledge(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 3,
    ) -> List[Dict[str, Any]]:
        """
        Search knowledge base using term scoring across English, Tamil, and keywords.
        Returns top_k matching records sorted by relevance score.
        """
        if not query or not query.strip():
            return []

        q_terms = set(query.lower().split())

        scored_results = []
        for item in self.records:
            # Filter by category if specified
            if category and item.get("category", "").upper() != category.upper():
                continue

            score = 0.0
            q_en = item.get("question", "").lower()
            q_ta = item.get("questionTamil", "").lower()
            ans_en = item.get("answerEnglish", "").lower()
            ans_ta = item.get("answer", "").lower()
            keywords = [k.lower() for k in item.get("keywords", [])]

            query_lower = query.lower()

            # Exact substring match in questions or keywords (high score)
            if query_lower in q_ta or query_lower in q_en:
                score += 10.0
            if any(query_lower in kw for kw in keywords):
                score += 8.0

            # Term matches
            for term in q_terms:
                if len(term) < 2:
                    continue
                if term in q_ta:
                    score += 3.0
                if term in q_en:
                    score += 3.0
                if term in ans_ta:
                    score += 1.5
                if term in ans_en:
                    score += 1.5
                if any(term in kw for kw in keywords):
                    score += 4.0

            if score > 0:
                scored_results.append((score, item))

        # Sort descending by score
        scored_results.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in scored_results[:top_k]]

    def get_relevant_context(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 2,
    ) -> str:
        """
        Retrieves matching knowledge records and formats them as RAG context string
        for Gemini or local fallback generation.
        """
        matches = self.search_knowledge(query, category=category, top_k=top_k)

        if not matches:
            # Fall back to general category search if initial category search yielded 0 results
            if category:
                matches = self.search_knowledge(query, category=None, top_k=top_k)

        if not matches:
            return ""

        context_snippets = []
        for idx, match in enumerate(matches, 1):
            source_str = f" (Source: {match['source']})" if match.get("source") else ""
            snippet = f"[{idx}] {match.get('questionTamil') or match.get('question')}\n{match['answer']}{source_str}"
            context_snippets.append(snippet)

        return "\n\n---\n\n".join(context_snippets)


# Singleton instance
knowledge_service = KnowledgeService()
