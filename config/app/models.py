from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from datetime import datetime

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(default="student", max_length=50)

    def __str__(self):
        return self.user.username

    # def get_absolute_url(self):
    #     return reverse('users:profile', args=[self.user.username])


class Question(models.Model):
    idx = models.IntegerField()
    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(blank=True)
    code = models.TextField(blank=True)

    def get_absolute_url(self):
        return reverse('app:question', args=[self.idx])


class AnnotationLog(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    session = models.CharField(max_length=200)
    question = models.TextField(blank=True)
    annotation = models.CharField(max_length=200)
    selection = models.TextField(blank=True)
    code = models.TextField(blank=True)
    create_time = models.DateTimeField(auto_now_add=True)

