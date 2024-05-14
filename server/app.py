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

class Login(Resource, SerializerMixin):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        role = request.get_json()['role']

        if role == 'teacher':
            teacher = Teacher.query.filter(Teacher.username == username).first()
            if teacher:
                if teacher.password == password:
                    session['teacher_id'] = teacher.id
                    return teacher.to_dict(), 200
                else:
                    return {'error': 'Incorrect Password'}
            return {'error': 'Teacher not found'}, 400
        
        if role == 'student':
            student = Student.query.filter(Student.username == username).first()
            if student:
                if student.password == password:
                    session['student_id'] = student.id
                    return student.to_dict(), 200
                else:
                    return {'error': 'Incorrect Password'}
            return {'error': 'Student not found'}, 400
        
api.add_resource(Login, '/api/login')

class Logout(Resource, SerializerMixin):
    def delete(self):
        if session.get('teacher_id'):
            del session['teacher_id']
            return {'message': 'Successfully logged out'}, 200
    
        if session.get('student_id'):
            del session['student_id']
            return {'message': 'Successfully logged out'}, 200
        
        return {'error': 'You are already logged out'}, 401
    
api.add_resource(Logout, '/api/logout')

class CheckSession(Resource, SerializerMixin):
    def get(self):
        teacher_id = session.get('teacher_id')
        student_id = session.get('student_id')
        if teacher_id:
            teacher = Teacher.query.filter_by(id=teacher_id).first()
            return teacher.to_dict(), 200
        if student_id:
            student = Student.query.filter_by(id=student_id).first()
            return student.to_dict(), 200
        return {}, 204
api.add_resource(CheckSession, '/api/check_session')


class Teachers(Resource, SerializerMixin):
    def get(self):
        return [teacher.to_dict() for teacher in Teacher.query.all()]
api.add_resource(Teachers, '/api/teachers')

class TeachersById(Resource, SerializerMixin):
    def get(self, id):
        teacher = Teacher.query.filter_by(id=id).first()
        return teacher.to_dict()
api.add_resource(TeachersById, '/api/teachers/<int:id>')


class Students(Resource, SerializerMixin):
    def get(self):
        return [student.to_dict() for student in Student.query.all()]
api.add_resource(Students, '/api/students')

class StudentsById(Resource, SerializerMixin):
    def get(self, id):
        student = Student.query.filter_by(id=id).first()
        return student.to_dict()
api.add_resource(StudentsById, '/api/students/<int:id>')


class Groups(Resource, SerializerMixin):
    def get(self):
        return [group.to_dict() for group in Group.query.all()]
    
    def post(self):
        if not session['teacher_id']:
            return {'error': 'Unauthorized'}, 401
        
        request_json = request.get_json()
        title = request_json.get('title')
        description = request_json.get('description')
        teacher_id = session['teacher_id']

        new_group = Group(
            title=title,
            description=description,
            teacher_id=teacher_id
        )
        try:
            db.session.add(new_group)
            db.session.commit()
            return new_group.to_dict(), 201
        except IntegrityError:
            return {'error': 'could not create group'}, 422
api.add_resource(Groups, '/api/groups')

class GroupsById(Resource, SerializerMixin):
    def get(self, id):
        group = Group.query.filter_by(id=id).first()
        return group.to_dict()
    
    def patch(self, id):
        if not session['teacher_id']:
            return {'error': 'Unauthorized'}
        
        group = Group.query.filter_by(id = id).first()

        if group:
            data = request.get_json()
            for attr in data:
                setattr(group, attr, data.get(attr))

            db.session.add(group)
            db.session.commit()

            return group.to_dict(), 200
        return {'error': '404 Resource not found'}, 404
    
    def delete(self, id):
        if not session['teacher_id']:
            return {'error': 'Unauthorized'}
        
        group = Group.query.filter_by(id=id).first()

        if group:
            try:
                db.session.delete(group)
                db.session.commit()

                return {'message': 'Group deleted'}, 200
            except:
                return {'error': 'Unable to delete'}
        return {'error': 'Group not found'}
api.add_resource(GroupsById, '/api/groups/<int:id>')


class Messages(Resource, SerializerMixin):
    def get(self):
        return [message.to_dict() for message in Message.query.all()]
    
    def post(self):
        
        request_json = request.get_json()
        body = request_json.get('body')
        group_id = request_json.get('group_id')

        if session['teacher_id']:
            new_message = Message(
            body=body,
            teacher_id=session['teacher_id'],
            group_id=group_id
            )

        elif session['student_id']:
            new_message = Message(
            body=body,
            student_id=session['student_id'],
            group_id=group_id
            )

        try:
            db.session.add(new_message)
            db.session.commit()
            return new_message.to_dict(), 201
        except IntegrityError:
            return {'error': 'could not create message'}, 422
        
api.add_resource(Messages, '/api/messages')

class MessagesById(Resource, SerializerMixin):
    def get(self, id):
        message = Message.query.filter_by(id=id).first()
        return message.to_dict()
api.add_resource(MessagesById, '/api/messages/<int:id>')


active_rooms = []

@sio.on('connect')
def handle_connect():
    print('WS server connected')

@sio.on('enter_room')
def handle_enter_room(data):
    username = data['username']
    roomID = data['room']
    global active_rooms
    room = next((room for room in active_rooms if room['room_id'] == data['room']), None)
    if room is None:
        room = {'room_id': data['room'], 'users': [username]}
        active_rooms.append(room)
    else:
        room['users'].append(username)
    print(active_rooms, 'from join')
    join_room(roomID)
    emit('user_joined', room, to=roomID)

@sio.on('leave_room')
def handle_leave_room(data):
    username = data['username']
    roomID = data['room']
    global active_rooms
    for room in active_rooms:
        if any(user == username for user in room['users']):
            room['users'] = [user for user in room['users'] if user != username]
    emit('user_left', room, to=roomID)
    leave_room(roomID)


@sio.on('send_message')
def handle_send_message(msg):
    print(msg)
    emit('new_message', msg['username'] + ': ' + msg['userInput'], to=msg['room'])

@sio.on('disconnect')
def handle_disconnect():
    print('WS server disconnected')


if __name__ == '__main__':
    sio.run(app, debug=True, port=5555)