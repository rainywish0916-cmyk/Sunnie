#users/Serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers,ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=(UniqueValidatorr(queryset=User.objects.all())]
            )
    password = seralizers.CharField(
            write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name')
        extra_kwargs = {
                'first_name': {'required': True},
                }
        
        def create(self, validated_data):
            user = User.objects.create(
                    username=validated_data['username'],
                    email=validated_data['email'],
                    first_name=validated_data['first_name'],
                    )

            user.set_password(validated_data['password'])
            user.save()

            return user


