import os

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt


# app = Flask(__name__)
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

app.config['SECRET_KEY'] = 'secret'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 
app.json.compact = False
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")
# 

app.secret_key = 'fe98017e6cafb94d4c075d447650b793'

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
api = Api(app)

db.init_app(app)

CORS(app, resources={r"/*":{"origins":"*"}})
sio = SocketIO(app, cors_allowed_origins="*")