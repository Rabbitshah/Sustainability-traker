from decimal import Decimal, ROUND_HALF_UP

# Conversion factors (kg CO2e per unit)
FACTORS = {
    'electricity': Decimal('0.82'),  # per kWh
    'fuel': Decimal('2.31'),         # per Litre (Diesel/Petrol avg)
    'waste': Decimal('0.52'),        # per kg
    'transport': Decimal('0.21'),    # per km (Average car)
    'water': Decimal('0.35'),        # per cubic meter
}

def calculate_co2e(category, value):
    """Calculates kg CO2e based on source category and raw value."""
    factor = FACTORS.get(str(category).lower(), Decimal('1.0'))
    quantity = Decimal(str(value))
    return (quantity * factor).quantize(Decimal('0.0001'), rounding=ROUND_HALF_UP)