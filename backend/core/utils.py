from datetime import date, timedelta
from django.db.models import Sum
from .models import EmissionRecord
from django.http import FileResponse

def generate_emission_insight(company=None):
    today = date.today()

    base_queryset = EmissionRecord.objects.all()
    if company is not None:
        base_queryset = base_queryset.filter(company=company)
    
    # 1. Current Month Data
    this_month_qs = base_queryset.filter(
        date__year=today.year, 
        date__month=today.month
    )
    this_month_total = this_month_qs.aggregate(Sum('co2e_impact'))['co2e_impact__sum'] or 0
    days_passed_this_month = today.day
    avg_daily_this_month = this_month_total / days_passed_this_month

    # 2. Last Month Data
    last_month_end = today.replace(day=1) - timedelta(days=1)
    last_month_qs = base_queryset.filter(
        date__year=last_month_end.year, 
        date__month=last_month_end.month
    )
    last_month_total = last_month_qs.aggregate(Sum('co2e_impact'))['co2e_impact__sum'] or 0
    
    # Use 30 as a standard divisor for last month
    avg_daily_last_month = last_month_total / 30 

    # 3. Enhanced Logic
    if last_month_total == 0:
        return {
            "status": "success",
            "message": "Welcome! Keep logging your activities to see a month-over-month comparison."
        }

    # Compare daily averages for a "Fair" comparison
    if avg_daily_this_month > avg_daily_last_month:
        diff = ((avg_daily_this_month - avg_daily_last_month) / avg_daily_last_month) * 100
        return {
            "status": "warning",
            "message": f"Your daily emission rate is up by {diff:.1f}% compared to last month. Consider optimizing your electricity usage!"
        }
    
    reduction = ((avg_daily_last_month - avg_daily_this_month) / avg_daily_last_month) * 100
    return {
        "status": "success",
        "message": f"Great work! Your daily impact is {reduction:.1f}% lower than last month. You're making a real difference!"
    }