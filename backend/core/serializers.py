from rest_framework import serializers
from .models import Company, EmissionRecord
from .models import UploadedFile


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = '__all__'
    class Meta:
        model = Company
        fields = '__all__'


class EmissionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionRecord
        fields = '__all__'

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = '__all__'