"""
Safety Service — Emergency detection and health safety layer
"""

EMERGENCY_KEYWORDS = [
    "chest pain", "மார்பு வலி", "heart attack", "மாரடைப்பு",
    "breathing difficulty", "மூச்சுத்திணறல்", "can't breathe", "unable to breathe",
    "unconscious", "மயக்கம்", "fainted", "not responding",
    "severe bleeding", "அதிக ரத்தம்", "stroke", "மூளை பக்கவாதம்",
    "seizure", "வலிப்பு", "fit", "convulsion",
    "anaphylaxis", "severe allergic", "poisoning", "நஞ்சு",
    "overdose", "suicide", "suicidal", "self harm",
    "accident", "விபத்து", "electric shock",
]

HEALTH_KEYWORDS = [
    "fever", "காய்ச்சல்", "pain", "வலி", "sick", "nausea",
    "vomit", "diarrhea", "cough", "diabetes", "நீரிழிவு",
    "blood pressure", "hypertension", "pregnant", "கர்ப்பம்",
    "medicine", "மருந்து", "doctor", "மருத்துவர்",
]


def detect_emergency(text: str) -> bool:
    lower = text.lower()
    return any(kw.lower() in lower for kw in EMERGENCY_KEYWORDS)


def is_health_query(text: str) -> bool:
    lower = text.lower()
    return any(kw.lower() in lower for kw in HEALTH_KEYWORDS)


def classify_risk(text: str) -> dict:
    if detect_emergency(text):
        return {"risk_level": "EMERGENCY", "priority": "Emergency", "requires_escalation": True}
    if is_health_query(text):
        return {"risk_level": "HEALTH", "priority": "Normal", "requires_escalation": False}
    return {"risk_level": "NONE", "priority": "Normal", "requires_escalation": False}


EMERGENCY_RESPONSE_TAMIL = """🚨 இது ஒரு மருத்துவ அவசரகால நிலையாக இருக்கலாம்.

**உடனடியாக 108 (ஆம்புலன்ஸ்) அழைக்கவும்.**

செய்ய வேண்டியவை:
1. 108 அழைக்கவும்
2. அமைதியாக இருங்கள்
3. கதவை திறந்து வையுங்கள்
4. இறுக்கமான ஆடைகளை தளர்த்துங்கள்

⚠️ GRAMA MITRA தகவல் சேவை மட்டுமே — அவசரகால சேவை அல்ல."""

EMERGENCY_RESPONSE_ENGLISH = """🚨 This appears to be a MEDICAL EMERGENCY.

**Call 108 (Ambulance) IMMEDIATELY.**

Steps to take now:
1. Call 108 immediately
2. Stay calm and follow operator instructions
3. Unlock doors if you are alone
4. Loosen tight clothing

⚠️ GRAMA MITRA is an information assistant only — NOT an emergency service. Please call 108 now."""
