from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="companies",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, default="India")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class EmissionRecord(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="emissions")
    date = models.DateField()
    category = models.CharField(max_length=100)  # electricity / fuel / logistics etc
    value = models.DecimalField(max_digits=12, decimal_places=4)  # kWh / liters etc
    unit = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    co2e_impact = models.DecimalField(max_digits=12, decimal_places=4, default=0)
    
    def __str__(self):
        return f"{self.company.name} - {self.category}"

class UploadedFile(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="uploads/")
    file_type = models.CharField(max_length=50, default="csv")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
