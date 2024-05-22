
# MODELS MODS
class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    role = db.Column(db.String, nullable=False)

    teachers = db.relationship('Teacher', back_populates='admins')
    students = db.relationship('Student', back_populates='admins')
    groups = db.relationship('Group', back_populates='admins')
    messages = db.relationship('Message', back_populates='admin', cascade='all, delete-orphan')

    serialize_rules = ()
    
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
        return f'Admin {self.id}: {self.username}'
    

    # teachers
admins = db.relationship('Admin', back_populates='teachers')
    # students
admins = db.relationship('Admin', back_populates='students')
    # groups
admins = db.relationship('Admin', back_populates='groups')
    # messages
admin = db.relationship('Admin', back_populates='messages')

# need serialize rules for all

# assign all new students (via signup) to all teachers
# ^^update teacher student to be many to many
enrollments = db.Table(
    'enrollments',
    db.Column('teacher_id', db.Integer, db.ForeignKey('teachers.id'), primary_key=True),
    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True)
)

# update Teacher's students and Students to teachers
    # students = db.relationship(
    #     'Student', secondary=enrollments, back_populates='teachers')
    # teachers = db.relationship(
    # 'Teacher', secondary=enrollments, back_populates='students')

# need ass table for Teachers, students, groups to admins



# APP MODS
# 
# >>Add below to Signup
# if role == 'admin':
#                 admin = Admin.query.filter(Admin.username == username).first()
#                 if admin:
#                     return {'error': 'Already signed up'}
#                 else:
#                     new_admin = Admin(
#                         username=username
#                     )
#                     new_admin.password_hash = password
#                     db.session.add(new_admin)
#                     db.session.commit()
#                     session['admin_id'] = new_admin.id
#                     return new_admin.to_dict(), 201

# >>Add below to Login
# if role == 'admin':
#             admin = Admin.query.filter(Admin.username == username).first()
#             if admin:
#                 is_authenticated = admin.authenticate(password)
#                 if is_authenticated:
#                     session['admin_id'] = admin.id
#                     return admin.to_dict(), 200
#                 else:
#                     return {'error': 'Incorrect Password'}
#             return {'error': 'Admin not found'}, 400

# >>Add below to Logout
# if session.get('admin_id'):
#             del session['admin_id']
#             return {'message': 'Successfully logged out'}, 200

# >>Add below to CheckSession
# admin_id = session.get('admin_id')
#         if admin_id:
#             admin = Admin.query.filter_by(id=admin_id).first()
#             return admin.to_dict(), 200

# New Admins Resources
class Admins(Resource, SerializerMixin):
    def get(self):
        return [admin.to_dict() for admin in Admin.query.all()]
    
api.add_resource(Admins, '/api/admins')

class AdminsById(Resource, SerializerMixin):
    def get(self, id):
        admin = Admin.query.filter_by(id=id).first()
        return admin.to_dict()
    
api.add_resource(AdminsById, '/api/admins/<int:id>')