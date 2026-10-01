"""Guarded growth-cycle entry point. Full agent implementation should keep research, writing, verification and release as separate stages."""
import os, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
MIN_WORDS=1500
MAX_WORDS=2200


def validate_article(markdown: str):
    words=len(re.findall(r"\\b[\\w’'-]+\\b", markdown))
    if not MIN_WORDS <= words <= MAX_WORDS:
        raise ValueError(f"Article must contain 1500-2200 words; got {words}")
    if re.search(r"BEGIN PRIVATE KEY|ghp_[A-Za-z0-9]{20,}", markdown):
        raise ValueError("Possible secret detected")
    return words


def required_environment():
    if not os.getenv("OPENROUTER_API_KEY"):
        raise RuntimeError("Missing OPENROUTER_API_KEY repository secret")


def main():
    required_environment()
    print("Grandmaster Growth Harness ready: research -> write -> SEO/AEO -> verify -> PR -> deploy")
    print("Production policy: no direct main-branch edits; every change must pass verification.")

if __name__ == "__main__":
    main()
