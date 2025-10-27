from django.urls import path
from .views import animals

urlpatterns = [
    path("animals/", animals),
]