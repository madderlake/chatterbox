import React from "react";
import Chat from "./components/Chat";
import Join from "./components/Join";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Join />
      <Chat />
    </div>
  );
}

export default App;
