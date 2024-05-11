from flask import request, session
from flask_restful import Resource
from config import sio, app, api, db
from models import Teacher, Student, Group, Message, student_groups
from sqlalchemy_serializer import SerializerMixin
from flask_socketio import emit, join_room, leave_room, send
from sqlalchemy.exc import IntegrityError


class Home(Resource, SerializerMixin):
    def get(self):
        return {'message':'Project Server'}
    
api.add_resource(Home, '/')

if __name__ == '__main__':
    sio.run(app, debug=True, port=5555)