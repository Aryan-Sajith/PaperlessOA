from app import create_app
from flask import request, Response

app = create_app()

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res



if __name__ == '__main__':
    app.run(debug=True, port=50000)
    
