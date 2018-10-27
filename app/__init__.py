from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_moment import Moment

#captcha imports
from flask_session import Session
from flask_session_captcha import FlaskSessionCaptcha
#


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
moment = Moment(app)

#captcha init
Session(app)
captcha = FlaskSessionCaptcha(app)
#


login.login_view = 'login'
login.login_message_category = 'info'

from app import routes, models
