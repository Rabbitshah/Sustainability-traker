import pandas as pd
from .models import EmissionRecord
from .conversions import calculate_co2e

def process_csv(file_path, company):
    # Load the data
    df = pd.read_csv(file_path)

    # Validate columns
    required_columns = {"date", "category", "value", "unit"}
    if not required_columns.issubset(df.columns):
        raise Exception("CSV missing required columns: date, category, value, unit")

    # 1. Clean data: Ensure date is in YYYY-MM-DD format
    df['date'] = pd.to_datetime(df['date']).dt.date

    # 2. Prepare objects for bulk creation with Carbon Conversion
    records_to_create = [
        EmissionRecord(
            company=company,
            date=row["date"],
            category=row["category"],
            value=row["value"],
            unit=row.get("unit", "kg"),
            # 🔥 NEW: Automatically calculate the carbon impact
            co2e_impact=calculate_co2e(row["category"], row["value"])
        )
        for _, row in df.iterrows()
    ]

    # 3. Save everything in ONE database hit
    if records_to_create:
        EmissionRecord.objects.bulk_create(records_to_create)

    return True