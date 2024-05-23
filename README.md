# StudyBuddies

## Description

StudyBuddies is a chat application for students and teachers. Before I left teaching, I noticed a wave of students who were struggling to communicate digitally in any real capacity other than memes. I created this chat app so that teachers can place students in groups and facilitate digital study or learning sessions. The idea is that each chat room stores messages by user and the teacher can utilize these chats to provide feedback or grade using a rubric. After all, words are hard.

## Installation

Install dependencies and start up the client/server
```bash
pipenv install
pipenv shell
npm install --prefix client
cd server
python app.py
```
Open a new terminal
```bash
npm run dev --prefix client
```

## Usage

StudyBuddies is a simple and straightforward chat app.
Users log in as either teacher or student and join the appropriate chat room. Once there, users can activate and deactivate the chat as needed, or send messages for others to read either while connected or later when they connect.

![General Usage of StudyBuddies](client/src/media/StudyBuddiesGIF.gif)

## Credits

- [Flatiron](https://flatironschool.com/our-courses/)
- [Flask-SocketIO Docs](https://flask-socketio.readthedocs.io/en/latest/)
- [Socket.io Docs](https://socket.io/docs/v4/)