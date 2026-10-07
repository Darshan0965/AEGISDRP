import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = "AEGISDRP API"
APP_VERSION = "0.1.0"
ENVIRONMENT = "development"

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured")