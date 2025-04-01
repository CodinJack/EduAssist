# Use Python base image
FROM python:3.11-slim

# Set the working directory
WORKDIR /backend

# Install dependencies inside the venv
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application files
COPY . .

# Expose the server port
EXPOSE 8080

# Set environment variables
ENV PYTHONUNBUFFERED=1
# Run the server using the venv Python
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8080"]

