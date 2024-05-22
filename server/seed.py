from random import choice as rc
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
        t1 = Teacher(
            username='Bob',
        )
        t1.password_hash='123'
        t2 = Teacher(
            username='Fred',
        )
        t2.password_hash='123'
        t3 = Teacher(
            username='Charles',
        )
        t3.password_hash='123'
        teachers = [t1,t2,t3]
        db.session.add_all(teachers)

        t1students = []

        for i in range(20):
            student = Student(
                username=fake.unique.first_name(),
            )
            student.password_hash='123'
            student.teacher = t1
            t1students.append(student)

        db.session.add_all(t1students)

        t2students = []

        for i in range(20):
            student = Student(
                username=fake.unique.first_name(),
            )
            student.password_hash='123'
            student.teacher = t2
            t2students.append(student)

        db.session.add_all(t2students)

        t3students = []

        for i in range(20):
            student = Student(
                username=fake.unique.first_name(),
            )
            student.password_hash='123'
            student.teacher = t3
            t3students.append(student)

        db.session.add_all(t3students)

        g1 = Group(
            title=fake.unique.name(),
            description=fake.unique.sentence(),
            teacher=t1,
        )
        g1.students.append(t1students[0])
        g1.students.append(t1students[1])
        g1.students.append(t1students[2])
        g1.students.append(t1students[3])
        g1.students.append(t1students[4])
        g1.students.append(t1students[5])
        g1.students.append(t1students[6])
        g1.students.append(t1students[7])
        g1.students.append(t1students[8])
        g1.students.append(t1students[9])
        g2 = Group(
            title=fake.unique.name(),
            description=fake.unique.sentence(),
            teacher=t1
        )
        g2.students.append(t1students[10])
        g2.students.append(t1students[11])
        g2.students.append(t1students[12])
        g2.students.append(t1students[13])
        g2.students.append(t1students[14])
        g2.students.append(t1students[15])
        g2.students.append(t1students[16])
        g2.students.append(t1students[17])
        g2.students.append(t1students[18])
        g2.students.append(t1students[19])

        g3 = Group(
            title=fake.unique.name(),
            description=fake.unique.sentence(),
            teacher=t2
        )
        g3.students.append(t2students[0])
        g3.students.append(t2students[1])
        g3.students.append(t2students[2])
        g3.students.append(t2students[3])
        g3.students.append(t2students[4])
        g3.students.append(t2students[5])
        g3.students.append(t2students[6])
        g3.students.append(t2students[7])
        g3.students.append(t2students[8])
        g3.students.append(t2students[9])
        g4 = Group(
            title=fake.unique.name(),
            description=fake.unique.sentence(),
            teacher=t2
        )
        g4.students.append(t2students[10])
        g4.students.append(t2students[11])
        g4.students.append(t2students[12])
        g4.students.append(t2students[13])
        g4.students.append(t2students[14])
        g4.students.append(t2students[15])
        g4.students.append(t2students[16])
        g4.students.append(t2students[17])
        g4.students.append(t2students[18])
        g4.students.append(t2students[19])

        g5 = Group(
            title=fake.unique.name(),
            description=fake.unique.sentence(),
            teacher=t3
        )
        g5.students.append(t3students[0])
        g5.students.append(t3students[1])
        g5.students.append(t3students[2])
        g5.students.append(t3students[3])
        g5.students.append(t3students[4])
        g5.students.append(t3students[5])
        g5.students.append(t3students[6])
        g5.students.append(t3students[7])
        g5.students.append(t3students[8])
        g5.students.append(t3students[9])
        g6 = Group(
            title=fake.unique.name(),
            description=fake.unique.sentence(),
            teacher=t3
        )
        g6.students.append(t3students[10])
        g6.students.append(t3students[11])
        g6.students.append(t3students[12])
        g6.students.append(t3students[13])
        g6.students.append(t3students[14])
        g6.students.append(t3students[15])
        g6.students.append(t3students[16])
        g6.students.append(t3students[17])
        g6.students.append(t3students[18])
        g6.students.append(t3students[19])

        groups = [g1,g2,g3,g4,g5,g6]
        t1groups = [g1,g2]
        t2groups = [g4,g3]
        t3groups = [g5,g6]
        db.session.add_all(groups)

        messages = []
        for i in range(25):
            message = Message(
                body=fake.unique.sentence()
            )
            message.teacher=rc(teachers)
            message.group=rc(groups)
            messages.append(message)
        
        for i in range(20):
            message = Message(
                body=fake.unique.sentence()
            )
            message.student=rc(t1students)
            message.group=rc(t1groups)
            messages.append(message)

        for i in range(20):
            message = Message(
                body=fake.unique.sentence()
            )
            message.student=rc(t2students)
            message.group=rc(t2groups)
            messages.append(message)

        for i in range(20):
            message = Message(
                body=fake.unique.sentence()
            )
            message.student=rc(t3students)
            message.group=rc(t3groups)
            messages.append(message)

        db.session.add_all(messages)
        db.session.commit()
        print('Seed successful')