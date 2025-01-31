from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from gps.serializers import GPSDataSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail

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
    http_method_names = ["post"]

    @staticmethod
    def post(request, *args, **kwargs):
        name = request.data.get("name")
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

        user = User.objects.create_user(username=username, password=password, email=email, first_name=name)
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class AuthView(APIView):
    """
    Handles user login and token generation.
    Returns user object alongside tokens for React User Context.
    """
    permission_classes = [AllowAny]

    @staticmethod
    def post(request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        # Authenticate user
        user = authenticate(username=username, password=password)
        if user:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            # Return user data along with tokens
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
            }
            return Response({
                "token": str(refresh.access_token),
                "user": user_data,
            })

    @staticmethod
    def get(request):
        token = request.META.get("HTTP_AUTHORIZATION")
        if token and token.startswith("Bearer "):
            token = token.split(" ")[1]  # Extract the token
        else:
            pass
            return Response({"detail": "Authorization token missing or invalid"}, status=status.HTTP_401_UNAUTHORIZED)
        if token:
            access_token = AccessToken(token)
            try:
                user = User.objects.get(id=access_token["user_id"])
                return Response({"id": user.id, "username": user.username, "name": user.first_name}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)

        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ForgotPasswordView(ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='forgot-password')
    def forgot_password(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Generate a password reset token
        token = default_token_generator.make_token(user)
        # TODO: Sanitize
        uid = user.id

        # Construct reset URL
        reset_url = f"http://localhost:3000/reset-password?user_id={uid}&token={token}"

        # Send email
        send_mail(
            subject="Şifre Sıfırlama Bağlantısı",
            message=f"Aşağıdaki bağlantıya tıklayarak şifrenizi sıfırlayın:\n{reset_url}",
            from_email="apppinpoint4@gmail.com",
            recipient_list=[user.email],
        )

        return Response({"detail": "Password reset email sent"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        user_id = request.data.get("user_id")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not user_id or not token or not new_password:
            return Response({"detail": "user_id, token, and new_password are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # TODO: Sanitize
            uid = user_id
            user = User.objects.get(pk=uid)
        except (ValueError, User.DoesNotExist):
            return Response({"detail": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the token is valid
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's password
        user.password = make_password(new_password)
        user.save()

        return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Handles user logout by blacklisting the refresh token.
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        try:
            # Get the refresh token from the request body
            refresh_token = request.data.get("token")

            # Handle cases where the refresh token is missing
            if not refresh_token:
                return Response({"detail": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Validate the token type
            try:
                token = RefreshToken(refresh_token)  # Ensure it's a refresh token
                token.blacklist()  # Blacklist the token
            except Exception as e:
                return Response({"detail": "Invalid or expired refresh token"}, status=status.HTTP_406_NOT_ACCEPTABLE)

            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)