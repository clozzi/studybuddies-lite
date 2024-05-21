from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt


student_groups = db.Table(
    'students_groups',
    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True),
)


class Teacher(db.Model, SerializerMixin):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)

    students = db.relationship('Student', back_populates='teacher')
    groups = db.relationship('Group', back_populates='teacher', cascade='all, delete-orphan')
    messages = db.relationship('Message', back_populates='teacher', cascade='all, delete-orphan')

    serialize_rules = ('-students.teacher', '-students.groups', '-students.messages', '-messages.teacher', 
                       '-groups.teacher')
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("No peeking!")
    
    @password_hash.setter
    def password_hash(self, password):
        new_hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = new_hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'Teacher {self.id}: {self.username}'
    

class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)

    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    teacher = db.relationship('Teacher', back_populates='students')

    groups = db.relationship('Group', secondary=student_groups, back_populates='students')
    messages = db.relationship('Message', back_populates='student', cascade='all, delete-orphan')

    serialize_rules = ('-groups.students', '-groups.messages', '-teacher.students',
                       '-teacher.groups', '-teacher.messages', '-teacher.password', 
                       '-messages.teacher', '-messages.student', '-messages.group')
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("No peeking!")
    
    @password_hash.setter
    def password_hash(self, password):
        new_hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = new_hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'Student {self.id}: {self.username}'
    

class Group(db.Model, SerializerMixin):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=True)
    description = db.Column(db.String)

    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    teacher = db.relationship('Teacher', back_populates='groups')

    students = db.relationship('Student', secondary=student_groups, back_populates='groups')
    messages = db.relationship('Message', back_populates='group', cascade='all, delete-orphan')

    serialize_rules = ('-teacher.students', '-teacher.groups', '-teacher.messages', 
                       '-students.groups', '-students.messages', '-students.teacher',
                        '-messages.group')

    def __repr__(self):
        return f'Group {self.id}: {self.title}'


class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String)

    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))

    teacher = db.relationship('Teacher', back_populates='messages')
    student = db.relationship('Student', back_populates='messages')
    group = db.relationship('Group', back_populates='messages')

    serialize_rules = ('-teacher.groups', '-teacher.messages', '-teacher.students',
                       '-student.groups', '-student.messages', '-student.groups',
                       '-group.students', '-group.messages', '-group.teacher')

    def __repr__(self):
        return f'Message {self.id}: {self.body}'