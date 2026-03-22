import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql://postgres:password@localhost:5432/mchanga_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Allow Vercel domains and localhost in development
    default_origins = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    # In production, add your Vercel URL
    vercel_url = os.environ.get("VERCEL_URL", "")
    if vercel_url:
        default_origins += f",https://{vercel_url},https://{vercel_url}.vercel.app"
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", default_origins).split(",")
    
    MPESA_CONSUMER_KEY = os.environ.get("MPESA_CONSUMER_KEY", "rPllpknnCWMyJ8TfbCPmZOWCopajTQVu9b7tDGphvFttAcyP")
    MPESA_CONSUMER_SECRET = os.environ.get("MPESA_CONSUMER_SECRET", "ikWgQpbZWSvfunUNLvr7gu9CDsuVw4EVweLbfGGX0KGeBxHpcCiE03Di30AwxHlM")
    MPESA_SHORTCODE = os.environ.get("MPESA_SHORTCODE", "174379")
    MPESA_PASSKEY = os.environ.get("MPESA_PASSKEY", "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919")
    MPESA_ENV = os.environ.get("MPESA_ENV", "sandbox")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}

