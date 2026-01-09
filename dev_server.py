#!/usr/bin/env python3
"""
Simple dev server with auto-reload for Mythbound Jump
"""
import http.server
import socketserver
import webbrowser
import os
import time
from pathlib import Path

PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS and cache control headers
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def watch_files():
    """Simple file watcher - checks for changes every 0.5 seconds"""
    last_modified = {}
    
    # Get initial modification times
    for file in DIRECTORY.glob('*.js'):
        last_modified[str(file)] = file.stat().st_mtime
    
    while True:
        time.sleep(0.5)
        changed = False
        for file in DIRECTORY.glob('*.js'):
            current_mtime = file.stat().st_mtime
            if str(file) not in last_modified or current_mtime > last_modified[str(file)]:
                changed = True
                last_modified[str(file)] = current_mtime
        
        if changed:
            print(f"\n[File changed - refresh your browser]")

if __name__ == '__main__':
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"Server starting at {url}")
        print(f"Serving directory: {DIRECTORY}")
        print("\nNote: This server doesn't auto-reload the browser.")
        print("Refresh manually when you see '[File changed]' messages.")
        print("Or install live-server for auto-reload: npm install -g live-server")
        print("\nPress Ctrl+C to stop\n")
        
        # Open browser
        webbrowser.open(url)
        
        # Start file watcher in background (simple version)
        import threading
        watcher = threading.Thread(target=watch_files, daemon=True)
        watcher.start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")
