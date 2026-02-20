FROM python:3.11-slim

# 1. Environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 2. Install system-level dependencies 
# Added build-essential for potential C-extensions in PDF/CSV libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# 4. Copy project files
COPY . .

# 5. Create media and static directories
# Essential so Celery and Django don't run into "Directory not found" errors
RUN mkdir -p /app/media /app/static

EXPOSE 8000

# Default command (overridden by celery_worker in docker-compose.yml)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]