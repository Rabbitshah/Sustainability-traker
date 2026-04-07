from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0004_emissionrecord_co2e_impact"),
    ]

    operations = [
        migrations.AlterField(
            model_name="emissionrecord",
            name="value",
            field=models.DecimalField(decimal_places=4, max_digits=12),
        ),
        migrations.AlterField(
            model_name="emissionrecord",
            name="co2e_impact",
            field=models.DecimalField(decimal_places=4, default=0, max_digits=12),
        ),
    ]
