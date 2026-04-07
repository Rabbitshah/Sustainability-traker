from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import status
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.http import FileResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .utils import generate_emission_insight
from .reports import generate_pdf_report 
from .models import Company, EmissionRecord, UploadedFile
from .serializers import (
    CompanySerializer,
    EmissionRecordSerializer,
    UploadedFileSerializer,
    RegisterSerializer,
)
from .tasks import process_uploaded_file
from .conversions import calculate_co2e


def get_or_create_user_company(user):
    company = Company.objects.filter(owner=user).first()
    if company:
        return company

    base_name = user.email.split("@")[0] if user.email else user.username
    return Company.objects.create(owner=user, name=f"{base_name}'s Company")


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    company = Company.objects.create(owner=user, name=f"{user.email.split('@')[0]}'s Company")

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "company_id": company.id,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):
    email = str(request.data.get("email", "")).strip().lower()
    if email:
        User.objects.filter(email__iexact=email).exists()

    return Response(
        {
            "message": "If an account exists for this email, reset instructions have been sent."
        },
        status=status.HTTP_200_OK,
    )

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.none()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Company.objects.none()
        return Company.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

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
    queryset = EmissionRecord.objects.none()
    serializer_class = EmissionRecordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return EmissionRecord.objects.none()

        company_ids = Company.objects.filter(owner=user).values_list("id", flat=True)
        return EmissionRecord.objects.filter(company_id__in=company_ids)

    def perform_create(self, serializer):
        """Calculates CO2e for manual entries before saving"""
        val = serializer.validated_data.get('value')
        cat = serializer.validated_data.get('category')
        impact = calculate_co2e(cat, val)
        company = get_or_create_user_company(self.request.user)
        serializer.save(company=company, co2e_impact=impact)

class UploadedFileViewSet(viewsets.ModelViewSet):
    queryset = UploadedFile.objects.none()
    serializer_class = UploadedFileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return UploadedFile.objects.none()

        company_ids = Company.objects.filter(owner=user).values_list("id", flat=True)
        return UploadedFile.objects.filter(company_id__in=company_ids)

    def perform_create(self, serializer):
        company = get_or_create_user_company(self.request.user)
        instance = serializer.save(company=company)
        process_uploaded_file.delay(instance.id)

class KPIViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def _user_company(self, request):
        user = request.user
        if not user or not user.is_authenticated:
            return None
        return Company.objects.filter(owner=user).first()
    
    @action(detail=False, methods=['get'])
    def total(self, request):
        company = self._user_company(request)
        if not company:
            return Response({"total_emissions": 0})

        total = EmissionRecord.objects.filter(company=company).aggregate(total=Sum('co2e_impact'))['total'] or 0
        return Response({"total_emissions": total})

    @action(detail=False, methods=['get'])
    def category(self, request):
        company = self._user_company(request)
        if not company:
            return Response([])

        data = EmissionRecord.objects.filter(company=company).values('category').annotate(
            value=Sum('co2e_impact')
        ).order_by('-value')
        return Response(list(data))

    @action(detail=False, methods=['get'])
    def monthly(self, request):
        company = self._user_company(request)
        if not company:
            return Response([])

        data = EmissionRecord.objects.filter(company=company).annotate(
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
    def ai_advice(self, request):
        company = self._user_company(request)
        insight = generate_emission_insight(company=company)
        return Response(insight)

    @action(detail=False, methods=['get'])
    def download_report(self, request):
        company = self._user_company(request)
        if not company:
            return Response({"detail": "No company profile found."}, status=status.HTTP_404_NOT_FOUND)

        pdf_buffer = generate_pdf_report(company)
        return FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename=f"Sustainability_Report_{company.name}.pdf",
        )