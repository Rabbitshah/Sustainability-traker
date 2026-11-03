from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, EmissionRecordViewSet, UploadedFileViewSet, KPIViewSet, categories_list

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'emissions', EmissionRecordViewSet)
router.register(r'files', UploadedFileViewSet)
router.register(r'kpis', KPIViewSet, basename='kpis') # Added this

urlpatterns = [
    path('categories/', categories_list),
    path('', include(router.urls)),
]