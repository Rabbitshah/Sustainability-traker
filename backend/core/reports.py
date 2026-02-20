from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from django.db.models import Sum
from .models import EmissionRecord
from .utils import generate_emission_insight
from datetime import date
import io

def generate_pdf_report(company):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # 1. Header
    p.setFont("Helvetica-Bold", 20)
    p.setStrokeColor(colors.green)
    p.drawString(100, height - 50, f"Sustainability Report: {company.name}")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, height - 70, f"Generated on: {date.today()}")
    p.line(100, height - 80, 500, height - 80)

    # 2. Key Statistics
    total = EmissionRecord.objects.filter(company=company).aggregate(Sum('value'))['value__sum'] or 0
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, height - 120, "Emission Summary")
    p.setFont("Helvetica", 12)
    p.drawString(100, height - 140, f"Total Carbon Footprint: {total:.2f} kg CO2e")

    # 3. AI Insights Section
    insight = generate_emission_insight()
    p.rect(95, height - 210, 410, 50, fill=0)
    p.setFont("Helvetica-Oblique", 11)
    p.drawString(105, height - 180, "AI Analysis & Advice:")
    p.drawString(105, height - 200, f"\"{insight['message']}\"")

    # 4. Data Table Header
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, height - 250, "Recent Logs")
    p.line(100, height - 255, 500, height - 255)
    
    y = height - 280
    p.setFont("Helvetica", 10)
    records = EmissionRecord.objects.filter(company=company).order_by('-date')[:10]
    
    for rec in records:
        if y < 50: # Simple page overflow check
            p.showPage()
            y = height - 50
        p.drawString(100, y, f"{rec.date}")
        p.drawString(200, y, f"{rec.category}")
        p.drawString(400, y, f"{rec.value} {rec.unit}")
        y -= 20

    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer