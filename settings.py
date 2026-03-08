INSTALLED_APPS = [
        ......,
        # Apps
        'Users',
        #Tools
        "coresheaders",
        'rest_framework',
        'rest_framework_simplejwt.token_blacklist',
     ]
from datetime import timedelta

REST_FRAMEWORK  = {
        'DEFAULT_PERMISSION_CLASSES': (
            'rest_framework.permissions.DjangoModelPermissions',
            ),
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            ),
        'DEFAULT_PARSER_CLASSES': [
            'rest_framework.parsers.JSONParser',
            'rest_framework.parsers.FormParser',
            'rest_framework.parsers.MultiPartParser'
            ]
        }
SIMPLE_JWT = {
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=20),
        'REFRESH_TOKEN_LIFETIME': timedelta(days=200),
        'ROTATE_REFRESH_TOKENS': True,
        'BLACKLIST_AFTER_ROTATION': True,
        'UPDATE_LAST_LOGIN': False,

        'ALGORITHM': 'HS256',
        'SIGNING_KEY': SECRET_KEY,
        'VERIFTING_KEY': None,
        'ISSUER': None,
        'JWK_URL': None,
        'LEEWAY': 0,

        'AUTH_HEADER_TYPES': ('Bearer',),
        'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
        'USER_ID_FIELD': 'id'
        'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

        'AUTH_TOKEN_CLASSES': 'rest_framework_simplejwt.tokens.AccessToken',),
        'TOKEN_TYPE_CLAIM': 'token_type',
        'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
        'JTI_CLAIM': 'jti',

        'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
        'SLIDING_TOKEN_LIFETIME': timedelta(minutes=20),
        'SLIDING_ROKEN_REFRESH_LIFETIME': timedelta(days=1),
        }

