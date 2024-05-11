from sqlalchemy_serializer import SerializerMixin
# from sqlalchemy.orm import validates
from config import db

student_groups = db.Table(
    'students_groups',
    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True),
)

class Teacher(db.Model, SerializerMixin):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'Teacher {self.id}: {self.username}'
    
class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)

    groups = db.relationship('Group', secondary=student_groups, back_populates='students')

    def __repr__(self):
        return f'Student {self.id}: {self.username}'
    
class Group(db.Model, SerializerMixin):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=True)
    description = db.Column(db.String)

    students = db.relationship('Student', secondary=student_groups, back_populates='groups')

    def __repr__(self):
        return f'Group {self.id}: {self.title}'

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String)
    # timestamp = db.Column(db.DateTime)

    def __repr__(self):
        return f'Message {self.id}: {self.body}'