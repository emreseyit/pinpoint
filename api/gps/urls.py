from django.urls import path
from .views import GPSDataView, AuthView, RegisterView

urlpatterns = [
    path('gps-data/', GPSDataView.as_view(), name='gps-data'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', AuthView.as_view(), name='login'),
]
