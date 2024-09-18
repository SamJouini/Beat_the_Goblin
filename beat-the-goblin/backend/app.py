from flask import Flask
from flask_cors import CORS
from routes.signup import bp as signup_bp

app = Flask(__name__)
app.register_blueprint(signup_bp)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
