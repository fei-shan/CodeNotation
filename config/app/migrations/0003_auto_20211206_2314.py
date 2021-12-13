# Generated by Django 3.2.8 on 2021-12-06 23:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20211206_2235'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='title',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='annotationlog',
            name='question',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.question'),
        ),
    ]
