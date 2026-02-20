from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.http import FileResponse

from .utils import generate_emission_insight
from .reports import generate_pdf_report 
from .models import Company, EmissionRecord, UploadedFile
from .serializers import CompanySerializer, EmissionRecordSerializer, UploadedFileSerializer
from .tasks import process_uploaded_file
from .conversions import calculate_co2e

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'])
    def download_report(self, request, pk=None):
        company = self.get_object()
        pdf_buffer = generate_pdf_report(company)
        return FileResponse(
            pdf_buffer, 
            as_attachment=True, 
            filename=f"Sustainability_Report_{company.name}.pdf"
        )

class EmissionRecordViewSet(viewsets.ModelViewSet):
    queryset = EmissionRecord.objects.all()
    serializer_class = EmissionRecordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Calculates CO2e for manual entries before saving"""
        val = serializer.validated_data.get('value')
        cat = serializer.validated_data.get('category')
        impact = calculate_co2e(cat, val)
        serializer.save(co2e_impact=impact)

class UploadedFileViewSet(viewsets.ModelViewSet):
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        instance = serializer.save()
        process_uploaded_file.delay(instance.id)

class KPIViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['get'])
    def total(self):
        # 🔥 Now summing the actual CO2e impact
        total = EmissionRecord.objects.aggregate(total=Sum('co2e_impact'))['total'] or 0
        return Response({"total_emissions": total})

    @action(detail=False, methods=['get'])
    def category(self):
        # Grouping by CO2e impact for a more accurate Donut Chart
        data = EmissionRecord.objects.values('category').annotate(
            value=Sum('co2e_impact')
        ).order_by('-value')
        return Response(list(data))

    @action(detail=False, methods=['get'])
    def monthly(self):
        data = EmissionRecord.objects.annotate(
            month_date=TruncMonth('date')
        ).values('month_date').annotate(
            value=Sum('co2e_impact')
        ).order_by('month_date')

        formatted_data = [
            {"month": item['month_date'].strftime('%Y-%m-%d'), "value": item['value']}
            for item in data
        ]
        return Response(formatted_data)
    
    @action(detail=False, methods=['get'])
    def ai_advice(self):
        insight = generate_emission_insight()
        return Response(insight)