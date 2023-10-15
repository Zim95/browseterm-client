#!/bin/bash

# Define container and image information
CONTAINER_NAME="browseterm-client"
IMAGE_NAME="browseterm-client:latest"

# Run the Docker container
docker run -d \
  -p 0.0.0.0:8001:8001 \
  --name "$CONTAINER_NAME" \
  -v "$(pwd):/app" \
  "$IMAGE_NAME"