from rest_framework import serializers

class GPSDataSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    timestamp = serializers.DateTimeField()
