.PHONY: run game stop install help

PORT ?= 8000

# Default target
help:
	@echo "Mythbound Jump - Development Commands"
	@echo ""
	@echo "  make run    - Start dev server with auto-reload and open browser"
	@echo "  make game   - Alias for 'make run'"
	@echo "  make stop   - Stop the dev server"
	@echo "  make install - Install live-server (one-time setup)"
	@echo ""

# Check if live-server is available, if not use Python fallback
run game:
	@if command -v live-server >/dev/null 2>&1; then \
		echo "Starting live-server with auto-reload..."; \
		live-server --port=$(PORT) --open=/index.html --watch=. --ignore="node_modules,*.log,.git" & \
		echo $$! > .server.pid; \
		echo "Server running on http://localhost:$(PORT)"; \
		echo "Auto-reload enabled - changes will refresh automatically!"; \
		echo "Press Ctrl+C or run 'make stop' to stop"; \
	else \
		echo "live-server not found. Using Python fallback..."; \
		echo "For auto-reload, run 'make install' first"; \
		python3 dev_server.py & \
		echo $$! > .server.pid; \
		echo "Server running on http://localhost:$(PORT)"; \
		echo "Press Ctrl+C or run 'make stop' to stop"; \
	fi

# Install live-server globally
install:
	@if command -v npm >/dev/null 2>&1; then \
		echo "Installing live-server..."; \
		npm install -g live-server; \
		echo "live-server installed! Now run 'make run'"; \
	else \
		echo "npm not found. Please install Node.js first:"; \
		echo "  brew install node  (on macOS)"; \
		echo "  or visit https://nodejs.org/"; \
	fi

# Stop the server
stop:
	@if [ -f .server.pid ]; then \
		kill `cat .server.pid` 2>/dev/null || true; \
		rm .server.pid; \
		echo "Server stopped."; \
	else \
		echo "No server running (no .server.pid file found)"; \
		echo "You may need to manually kill the process"; \
	fi
