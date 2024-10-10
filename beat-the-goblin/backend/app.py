from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from routes.signup import bp as signup_bp
from routes.login import bp as login_bp
from routes.tasks import bp as tasks_bp
from routes.deadline import bp as deadline_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'beat_the_goblin'  # Change this to imptove security!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)  # Set token to expire after 5 hours ?
jwt = JWTManager(app)

# blueprints
app.register_blueprint(signup_bp)
app.register_blueprint(login_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(deadline_bp)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
