import logo from "./logo.svg";
import "./App.css";
// src/App.js
import React from "react";
import "./App.css";
import ScreenplayEditor from "./screenplay_editor";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Screenplay Sequence Editor</h1>
      </header>
      <main>
        <ScreenplayEditor />
      </main>
    </div>
  );
}

export default App;
