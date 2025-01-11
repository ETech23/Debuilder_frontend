from http.server import BaseHTTPRequestHandler, HTTPServer
import os

class MyRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        # Get the requested path and remove leading slashes
        requested_path = self.path.lstrip("/")

        # Check if the requested path exists (assuming files are in the same directory)
        if os.path.exists(requested_path):
            # Determine the content type based on file extension
            if requested_path.endswith(".html"):
                content_type = "text/html"
            elif requested_path.endswith(".css"):
                content_type = "text/css"
            elif requested_path.endswith(".js"):
                content_type = "text/javascript"
            else:
                content_type = "text/plain"

            # Open the requested file and read its content
            with open(requested_path, 'rb') as f: 
                file_content = f.read()

            # Send a 200 OK response with the appropriate content type
            self.send_response(200)
            self.send_header("Content-type", content_type)
            self.end_headers()

            # Send the file content
            self.wfile.write(file_content)
        else:
            # Send a 404 Not Found response if the file doesn't exist
            self.send_error(404, "File not found")

def run(server_class=HTTPServer, handler_class=MyRequestHandler, port=3000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print('Starting httpd on port {0}'.format(port))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print('Stopping httpd...')

if __name__ == '__main__':
    run()
