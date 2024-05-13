"""initial

Revision ID: e5b3903d0abf
Revises: 
Create Date: 2024-05-11 13:30:05.800977

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5b3903d0abf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('teachers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('password', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('groups',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('teacher_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['teacher_id'], ['teachers.id'], name=op.f('fk_groups_teacher_id_teachers')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('title')
    )
    op.create_table('students',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('teacher_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['teacher_id'], ['teachers.id'], name=op.f('fk_students_teacher_id_teachers')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('body', sa.String(), nullable=True),
    sa.Column('teacher_id', sa.Integer(), nullable=True),
    sa.Column('student_id', sa.Integer(), nullable=True),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], name=op.f('fk_messages_group_id_groups')),
    sa.ForeignKeyConstraint(['student_id'], ['students.id'], name=op.f('fk_messages_student_id_students')),
    sa.ForeignKeyConstraint(['teacher_id'], ['teachers.id'], name=op.f('fk_messages_teacher_id_teachers')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('students_groups',
    sa.Column('student_id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], name=op.f('fk_students_groups_group_id_groups')),
    sa.ForeignKeyConstraint(['student_id'], ['students.id'], name=op.f('fk_students_groups_student_id_students')),
    sa.PrimaryKeyConstraint('student_id', 'group_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('students_groups')
    op.drop_table('messages')
    op.drop_table('students')
    op.drop_table('groups')
    op.drop_table('teachers')
    # ### end Alembic commands ###