import pdfplumber
import re
from datetime import datetime
from .models import EmissionRecord
from .conversions import calculate_co2e

def extract_number(text):
    numbers = re.findall(r"\d+\.\d+|\d+", text)
    return float(numbers[0]) if numbers else None

def extract_date(text):
    """Finds dates in formats like DD/MM/YYYY or YYYY-MM-DD."""
    date_pattern = r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})"
    iso_pattern = r"(\d{4}-\d{2}-\d{2})"
    matches = re.findall(f"{date_pattern}|{iso_pattern}", text)
    if matches:
        date_str = matches[0][0] if matches[0][0] else matches[0][1]
        for fmt in ("%d-%m-%Y", "%Y-%m-%d", "%d-%m-%y"):
            try:
                return datetime.strptime(date_str.replace('/', '-'), fmt).date()
            except ValueError: continue
    return datetime.now().date()

def process_pdf(file_path, company):
    with pdfplumber.open(file_path) as pdf:
        text = "".join([page.extract_text() or "" for page in pdf.pages])

    text_lower = text.lower()
    if "electricity" in text_lower or "kwh" in text_lower:
        category, unit = "Electricity", "kWh"
    elif any(word in text_lower for word in ["fuel", "diesel", "litre"]):
        category, unit = "Fuel", "L"
    else: category, unit = "Waste", "kg"

    value = extract_number(text)
    impact = calculate_co2e(category, value)

    EmissionRecord.objects.create(
        company=company,
        date=extract_date(text),
        category=category,
        value=value,
        unit=unit,
        co2e_impact=impact
    )
    return True