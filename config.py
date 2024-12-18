import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    GROQ_API_KEY = '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'