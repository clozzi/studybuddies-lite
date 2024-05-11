from random import randint, choice as rc
from faker import Faker

from app import app
from models import db, Teacher, Student, Group, Message, student_groups

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        print('Deleting...')
        db.session.query(student_groups).delete()
        db.session.commit()
        Teacher.query.delete()
        Student.query.delete()
        Group.query.delete()
        Message.query.delete()

        print('Seeding...')