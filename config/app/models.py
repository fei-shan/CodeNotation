from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from datetime import datetime

# Create your models here.
class AnnotationLog(models.Model):
    session_id = models.CharField(max_length=200)
    question_id = models.CharField(max_length=200)
    annotation = models.CharField(max_length=200)
    selection = models.TextField(blank=True)
    code = models.TextField(blank=True)
    create_time = models.DateTimeField(auto_now_add=True)

