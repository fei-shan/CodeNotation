from django.urls import path
from . import views

app_name = 'app'
urlpatterns = [
    path('', views.app_home, name='home'),
    path('annotate/add', views.app_logs_add, name='log'),
]