from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, EmissionRecord
from .models import UploadedFile
from .conversions import CATEGORIES


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ("owner",)


class EmissionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionRecord
        fields = '__all__'
        read_only_fields = ("company", "co2e_impact")
        extra_kwargs = {"unit": {"required": False}}

    def validate_category(self, value):
        key = value.strip().lower()
        if key not in CATEGORIES:
            raise serializers.ValidationError(
                f"Unknown category. Allowed: {', '.join(sorted(CATEGORIES))}."
            )
        return key

    def validate(self, attrs):
        # On PATCH the category may come from the stored record.
        category = attrs.get("category") or (self.instance and self.instance.category.lower())
        if category not in CATEGORIES:
            raise serializers.ValidationError({"category": "Unknown category."})
        expected = CATEGORIES[category]["unit"]
        unit = attrs.get("unit")
        if unit and unit.strip().lower() != expected.lower():
            raise serializers.ValidationError({"unit": f"Unit for {category} must be {expected}."})
        attrs["unit"] = expected
        return attrs

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = '__all__'
        read_only_fields = ("company",)


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
        )
        return user