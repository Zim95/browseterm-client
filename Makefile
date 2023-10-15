# Makefile for building and pushing Docker image

# Define the script files
BUILD_SCRIPT = ./scripts/build.sh
PUSH_SCRIPT = ./scripts/push.sh
RUN_SCRIPT = ./scripts/run.sh

# Targets

build:
	@chmod +x $(BUILD_SCRIPT)
	@echo "Building Docker image..."
	@$(BUILD_SCRIPT)

push:
	@chmod +x $(PUSH_SCRIPT)
	@echo "Pushing Docker image to the repository..."
	@$(PUSH_SCRIPT)

run:
	@chmod +x $(RUN_SCRIPT)
	@echo "Running Docker container..."
	@$(RUN_SCRIPT)

buildpush: build push

buildrun: build run

buildpushrun: build push run

.PHONY: build push run buildpush buildrun buildpushrun
