from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import re

PORT = 8001
MAIN_JS_PATH = os.path.join(os.path.dirname(__file__), '..', 'js', 'main.js')

class BirthdayHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()
        
    def do_POST(self):
        if self.path == '/api/save-caption':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                media_src = data.get('src')
                new_caption = data.get('caption')
                
                if not media_src or new_caption is None:
                    raise ValueError("Dados incompletos")
                    
                # Lemos o main.js atual
                with open(MAIN_JS_PATH, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Regex para encontrar o dicionário especifico da mídia e atualizar seu 'caption'
                # Escapamos caracteres especiais no src pra usar no regex
                escaped_src = re.escape(media_src)
                
                # Padrão: { src: 'escaped_src', caption: 'qualquer_coisa', ... }
                # Usamos um lookahead/lookbehind approach ou replace via re.sub
                
                def replace_caption(match):
                    full_match = match.group(0)
                    old_caption = match.group(1)
                    # Substitui apenas a string do caption dentro do match mantendo o resto
                    return full_match.replace(f"caption: '{old_caption}'", f"caption: '{new_caption}'")
                
                # Procura o bloco exato da memoria no JS
                pattern = r"\{\s*src:\s*'" + escaped_src + r"'.*?caption:\s*'([^']*)'.*?\}"
                
                new_content, count = re.subn(pattern, replace_caption, content)
                
                if count > 0:
                    with open(MAIN_JS_PATH, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'success'}).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Mídia não encontrada no código JS'}).encode('utf-8'))
                    
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    # Mudamos o diretório para servir na raiz do projeto
    os.chdir(os.path.join(os.path.dirname(__file__), '..'))
    server_address = ('', 8001)
    httpd = HTTPServer(server_address, BirthdayHandler)
    print(f"==================================================")
    print(f"🚀 Servidor Local API Rodando na porta 8001")
    print(f"==================================================")
    httpd.serve_forever()
