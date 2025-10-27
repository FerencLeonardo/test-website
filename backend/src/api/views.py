from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Animal
from .serializers import AnimalSerializer

@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def animals(request):
    if request.method == "GET":
        qs = Animal.objects.order_by("-id")
        return Response(AnimalSerializer(qs, many=True).data)
    
    name = (request.data.get("name") or "").strip()
    if not name:
        return Response({"detail": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = AnimalSerializer(data={"name": name})
    if serializer.is_valid():
        instance = serializer.save()
        return Response(AnimalSerializer(instance).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)