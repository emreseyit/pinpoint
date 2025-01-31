from django.urls import path
from .views import GPSDataView, AuthView, RegisterView, ForgotPasswordView, ResetPasswordView, LogoutView

urlpatterns = [
    path('gps-data/', GPSDataView.as_view(), name='gps-data'),
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/', AuthView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view({"post": "forgot_password"}), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
