from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import EmissionRecord


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def total_emissions(request):
    total = EmissionRecord.objects.aggregate(total=Sum("value"))["total"] or 0
    return Response({"total_emissions": total})


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def emissions_by_category(request):
    data = (
        EmissionRecord.objects.values("category")
        .annotate(total=Sum("value"))
        .order_by("-total")
    )
    return Response(list(data))


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def emissions_monthly_trend(request):
    data = (
        EmissionRecord.objects.annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("value"))
        .order_by("month")
    )
    return Response(list(data))
