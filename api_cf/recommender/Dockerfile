# Use a lightweight Python base image
FROM python:3.10-slim

# Set working directory in container
WORKDIR /app

# Copy requirement file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application code and model file
COPY . . 

# Expose the port (if Flask runs on 5000 by default)
EXPOSE 5000

# Define environment variable for Flask
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Command to run the Flask app (use gunicorn for production for better performance)
# Using Flask's built-in server for simplicity here:
CMD ["python", "app.py"]
