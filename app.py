#!/usr/bin/env python3
import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import requests
import socketserver

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Serve static files
        if path == '/' or path == '/index.html':
            self.serve_file('index.html', 'text/html')
        elif path.endswith('.html'):
            self.serve_file(path[1:], 'text/html')
        elif path.endswith('.css'):
            self.serve_file(path[1:], 'text/css')
        elif path.endswith('.js'):
            self.serve_file(path[1:], 'application/javascript')
        elif path.endswith('.png'):
            self.serve_file(path[1:], 'image/png')
        else:
            self.send_error(404)
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/chat':
            self.handle_chat_request()
        else:
            self.send_error(404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def handle_chat_request(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            user_message = data.get('message', '').strip()
            
            if not user_message:
                self.send_json_response({'error': 'Message is required'}, 400)
                return
            
            # Get AI response
            ai_response = self.get_ai_response(user_message)
            
            self.send_json_response({'response': ai_response})
            
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def get_ai_response(self, user_message):
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key:
            raise Exception('OpenAI API key not configured')
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        
        payload = {
            'model': 'gpt-4o-mini',
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are StudyBot, a helpful AI study assistant for SlayStudy. You help students with their studies in a friendly, encouraging way. Keep responses concise but informative. Use emojis occasionally to make learning fun. Focus on educational topics like homework help, explaining concepts, study strategies, and academic support.'
                },
                {
                    'role': 'user',
                    'content': user_message
                }
            ],
            'max_tokens': 500,
            'temperature': 0.7
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f'OpenAI API error: {response.status_code}')
        
        result = response.json()
        return result['choices'][0]['message']['content']
    
    def serve_file(self, filename, content_type):
        try:
            with open(filename, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404)
    
    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

if __name__ == '__main__':
    port = 5000
    server = HTTPServer(('0.0.0.0', port), RequestHandler)
    print(f'SlayStudy server running on http://0.0.0.0:{port}')
    server.serve_forever()