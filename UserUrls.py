from django.Urls import path
from rest_framework_simplejwt.views import ( TokenRefreshView, TokenObtainPairView)

urlpatterns = [
        path('api/token/', TokenObtainPairView.as_view(),
             name= 'token_obtain_pair'),
        path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        ]

from . import Views

urlpatterns = [
        ......,
        path('register/', views.RegisterView.as_view(), name='auth_register'),
        ]
[error 2147942593 (0x800700c1) when launching `C:\Users\rainy\Downloads\python-manager-26.0.msi']

