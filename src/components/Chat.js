import React, { Component } from "react";
import io from "socket.io-client";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.username,
      userList: this.props.userList ? this.props.userList : [],
      message: "",
      messageList: []
    };

    this.socket = io("localhost:8083");
    this.socket.on("RECEIVE_MESSAGE", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({
        messageList: [...this.state.messageList, data],
        userList: [...this.state.userList, data["author"]]
      });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      if (this.state.message && this.state.username) {
        this.socket.emit("SEND_MESSAGE", {
          author: this.state.username,
          message: this.state.message
        });
        this.setState({
          message: ""
        });
      }
    };
  }
  render() {
    const messages = this.state.messageList;
    const users = [...new Set(this.state.userList.map((user, idx) => user))];

    return (
      <div className="container">
        <div className="row">
          <div className="header">
            <h3>{this.state.username}'s Chatterbox</h3>
          </div>
          <div className="sidebar col-4">
            <h4>Who's Online?</h4>
            <ul className="user-list">
              {users.map((user, idx) => {
                return <li key={`usr-${idx + 1}`}>{user}</li>;
              })}
            </ul>
          </div>
          <div className="messages col-8">
            <h4>Chat Feed</h4>
            <div className="message-list">
              {messages.map((message, index) => {
                return (
                  <p key={`msg-${index + 1}`}>
                    {message.author}: {message.message}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
        <div className="add-message row">
          <form onSubmit={this.sendMessage}>
            <input
              type="text"
              placeholder="Type your Message"
              value={this.state.message}
              onChange={ev => this.setState({ message: ev.target.value })}
            />
            <input type="submit" className="btn btn-primary" value="Send" />
          </form>
        </div>
      </div>
    );
  }
}

export default Chat;
