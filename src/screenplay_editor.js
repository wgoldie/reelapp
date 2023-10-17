// src/ScreenplayEditor.js
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import "./screenplay_editor.css";

const DELIMITER = "\n#";

const sections = [
  "Sequence 1 - Introductions",
  "Sequence 2 - Dilemma",
  "Sequence 3 - First Obstacle",
  "Sequence 4 - Midpoint",
  "Sequence 5 - Twists & Turns",
  "Sequence 6 - Culmination / Low Point",
  "Sequence 7 - Climax",
  "Sequence 8 - Resolution",
];

const sectionDescriptions = ["", "", "", "", "", "", "", ""];

const ScreenplayEditor = () => {
  const [content, setContent] = useState(() => {
    const savedContent =
      JSON.parse(localStorage.getItem("screenplayContent"))?.slice(0, 8) ||
      Array(8).fill("");
    return savedContent;
  });

  const [title, setTitle] = useState("");

  const handleTextareaChange = (index, event) => {
    const newContent = [...content];
    newContent[index] = event.target.value;
    setContent(newContent);
  };

  useEffect(() => {
    // Save content to localStorage whenever it changes
    localStorage.setItem("screenplayContent", JSON.stringify(content));
  }, [content]);

  const handleSaveToFile = () => {
    const screenplayContent = content
      .map((c, i) => `# ${sections[i]}\n${c}\n`)
      .join("\n"); // Join sections with two new lines
    const blob = new Blob([screenplayContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "screenplay"}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const loadedContent = e.target.result.split(DELIMITER);
        setContent(
          loadedContent.map((section) => section.slice(section.indexOf("\n")))
        );
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="screenplay-editor">
      <div className="buttons">
        <button onClick={handleSaveToFile}>Save to File</button>
        <input type="file" accept=".txt" onChange={handleLoadFromFile} />
      </div>

      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter screenplay title"
      />
      <div className="grid-container">
        {sections.map((section, index) => (
          <Draggable key={index}>
            <div className="draggable-textarea">
              <div className="headers">
                <h2 className="section-header">{section}</h2>
                {/*<h3 title={sectionDescriptions[index]}>?</h3>*/}
              </div>
              <textarea
                value={content[index]}
                onChange={(event) => handleTextareaChange(index, event)}
                placeholder={`Enter content for ${section}`}
                rows="10"
                cols="50"
              />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default ScreenplayEditor;
