from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from gps.serializers import GPSDataSerializer
from rest_framework.permissions import AllowAny

class GPSDataView(APIView):
    permission_classes = ()
    @staticmethod
    def post(request):
        serializer = GPSDataSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer.validated_data)
            return Response({"message": "Data received successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]


    @staticmethod
    def register(request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        # Handle user signup
        if not username or not password or not email:
            return Response({"detail": "Username, password and e-mail are required for sign-up"},
                            status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"detail": "A user with this username already exists"},
                            status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class AuthView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def login(request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
