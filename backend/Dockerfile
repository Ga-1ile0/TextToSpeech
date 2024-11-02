FROM python:3.9-slim

# Install espeak and other dependencies
RUN apt-get update && apt-get install -y espeak libespeak1 ffmpeg

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Create a directory for your app
WORKDIR /app

# Copy your application files to the container
COPY . /app

# Expose the port that the Flask app will run on
EXPOSE 8080

# Use gunicorn to serve the app
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
