#users/views.py

from rest_framework.views import APIView
from rest_framework import permissons
from .Serializers import RegisterSerializer
from rest_framework.response import Response
from rest_framework import status

class RegisterView(APTView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        Serializer = Registerserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(seralizer.errors, status=status.HTTP_400_BAD_REQUEST)

