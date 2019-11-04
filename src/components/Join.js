import React, { Component } from "react";
import io from "socket.io-client";

class Join extends Component {
  socket = io("localhost:8083");

  sendUserAndGo = ev => {
    ev.preventDefault();
    if (this.state.username) {
      this.socket.emit("SEND_MESSAGE", {
        username: this.state.username
      });

      this.props.history.push(`/chat/${this.state.username}`);
    }
    return false;
  };

  render() {
    return (
      <div className="join-chat container">
        <h1 className="text-center">Welcome to ChatterBox!</h1>
        <form onSubmit={this.sendUserAndGo}>
          <input
            type="text"
            name="username"
            placeholder="Type your Name to Join Chat"
            onChange={ev => this.setState({ username: ev.target.value })}
          />
          <input type="submit" className="btn btn-primary" value="Join" />
        </form>
      </div>
    );
  }
}

export default Join;
