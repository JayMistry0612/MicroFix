import os
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from db import db
import bcrypt

load_dotenv()

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints (to be implemented)
    from auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    from routes.pdf_handler import pdf_bp
    app.register_blueprint(pdf_bp, url_prefix='/api')
    from routes.image_handler import image_bp
    app.register_blueprint(image_bp, url_prefix='/api')
    from routes.audio_handler import audio_bp
    app.register_blueprint(audio_bp, url_prefix='/api')
    from routes.tone_changer import tone_bp
    app.register_blueprint(tone_bp, url_prefix='/api')
    from routes.history_handler import history_bp
    app.register_blueprint(history_bp, url_prefix='/api')
    from routes.analysis_routes import analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/api')
    # ...

    @app.route('/')
    def index():
        return jsonify({'status': 'ok'})

    # @app.route('/api/test-add-user', methods=['POST'])
    # def test_add_user():
    #     from models.user import User
    #     username = "testuser"
    #     email = "test@example.com"
    #     password = "password123"
    #     password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    #
    #     user = User(username=username, email=email, password_hash=password_hash)
    #     db.session.add(user)
    #     db.session.commit()
    #     return {"message": "User added successfully!"}, 201

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        from models.user import User
        from models.history import RequestHistory
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
