# Conversion factors (kg CO2e per unit)
FACTORS = {
    'electricity': 0.82,  # per kWh
    'fuel': 2.31,         # per Litre (Diesel/Petrol avg)
    'waste': 0.52,        # per kg
    'transport': 0.21,    # per km (Average car)
    'water': 0.35,        # per cubic meter
}

def calculate_co2e(category, value):
    """Calculates kg CO2e based on source category and raw value."""
    factor = FACTORS.get(category.lower(), 1.0)
    return round(float(value) * factor, 2)