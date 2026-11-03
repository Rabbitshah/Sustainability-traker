from decimal import Decimal, ROUND_HALF_UP

# Single source of truth for categories, units and factors (kg CO2e per unit).
# Served to the frontend at GET /api/categories/ so the UI never keeps its own copy.
# TODO(user): every factor below is UNVERIFIED test data. Replace each with a
# sourced value (grid/IPCC/DEFRA-style tables) and write the source next to it.
CATEGORIES = {
    'energy':    {'unit': 'kWh', 'factor': Decimal('0.82')},  # TODO(user): source needed
    'fuel':      {'unit': 'L',   'factor': Decimal('2.31')},  # TODO(user): source needed
    'waste':     {'unit': 'kg',  'factor': Decimal('0.52')},  # TODO(user): source needed
    'transport': {'unit': 'km',  'factor': Decimal('0.21')},  # TODO(user): source needed
    'water':     {'unit': 'm3',  'factor': Decimal('0.35')},  # TODO(user): source needed
    'food':      {'unit': 'kg',  'factor': Decimal('0.60')},  # TODO(user): placeholder from old UI preview
}


def calculate_co2e(category, value):
    """kg CO2e for a category and raw value. Raises ValueError for an unknown category."""
    key = str(category).strip().lower()
    if key not in CATEGORIES:
        raise ValueError(f"Unknown category: {category!r}")
    quantity = Decimal(str(value))
    return (quantity * CATEGORIES[key]['factor']).quantize(Decimal('0.0001'), rounding=ROUND_HALF_UP)
