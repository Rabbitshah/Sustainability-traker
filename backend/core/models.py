from django.db import models

class Company(models.Model):
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
    value = models.FloatField()                  # kWh / liters etc
    unit = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    co2e_impact = models.FloatField(default=0.0)
    
    def __str__(self):
        return f"{self.company.name} - {self.category}"

class UploadedFile(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="uploads/")
    file_type = models.CharField(max_length=50, default="csv")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
