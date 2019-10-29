This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Installation
After cloning the repo (from root directory):
  1. `npm install`
  2. `npm start`
  3. `node server.js` [may need to change port in `server.js`, `join.js`, and `chat.js` if there is a conflict]
  
### Tech Stack
  1. React (CRA)
  2. React Router
  3. Sockets.io
  4. Bootstrap (not my favorite, but makes prototyping easier 🤷🏻‍♀️)
  5. Etc (dependencies)

### Overview
This is a basic chat app with websockets. I wanted to play around with sockets for real-time functionality, and router, so I could have the beginnings of an auth system. No need to burden you with logins and passwords at this point though, right?

I wanted to have a global list of users who are online. I started with Local Storage, but that would need to be managed, as it just keeps growing for each new user. It wouldn't be hard to implement a "Leave" functionality that would remove the user from the list, if I had had more time. Right now, user is added to the list only after they send a message, which prevents us from knowing about lurkers :)

### ToDo - Add more features
  1. Implement Redux or Local Storage for global user list 
  2. Implement Auth system
  3. Channels and topics
  
  

