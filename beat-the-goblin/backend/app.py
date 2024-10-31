from flask import Flask, json
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from routes.signup import bp as signup_bp
from routes.login import bp as login_bp
from routes.tasks_CRUD import bp as CRUD_bp
from routes.tasks_completed import bp as completed_bp
from routes.tasks_reorder import bp as reorder_bp
from routes.deadline import bp as deadline_bp

app = Flask(__name__)

# Set default values
app.config['JWT_SECRET_KEY'] = 'beat_the_goblin'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)  # Set token to expire after 5 hours ?

# Override with local conf
app.config.from_file("config.json", load=json.load, silent=True)
jwt = JWTManager(app)

# blueprints
app.register_blueprint(signup_bp)
app.register_blueprint(login_bp)
app.register_blueprint(CRUD_bp)
app.register_blueprint(completed_bp)
app.register_blueprint(reorder_bp)
app.register_blueprint(deadline_bp)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
