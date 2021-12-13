from django.urls import path
from . import views

app_name = 'app'
urlpatterns = [
    path('', views.app_home, name='home'),
    path('questions/<int:idx>', views.app_question, name='question'),
    path('annotate', views.app_annotate, name='annotate'),
]