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

const sectionDescriptions = [
  "The first sequence is our introduction to… well, everything. In this first section of the movie, we meet the characters, get to know the world they’re in, see hints at upcoming conflicts and tension, and learn the basic premise of the story. Sequence One typically ends with the Inciting Incident.",
  "After the Inciting Incident, there’s usually a period of time in which the protagonist considers the Call to Action. They debate whether or not to leave their familiar, comfortable world and proceed into the unknown. That’s what happens in this sequence, though it will look different in every story. By the end of Sequence Two, the protagonist is on the journey that will take them to the end of the movie and there’s no turning back.",
  "This is the start of Act Two; the protagonist has officially entered the new world. During Sequence Three, the protagonist faces their first real obstacle, new tensions and conflicts arise, and the stakes are raised.",
  "Some might call Sequence Four, along with Sequence Three, the “Fun and Games” of the movie. These two sections deliver on the “Promise of the Premise.” In Sequence Four, the protagonist faces another obstacle or dilemma that comes as a direct result of what happened in Sequence Three. This sequence usually ends with the Midpoint.",
  "Sequence Five usually contains the twists and turns of Act Two. This is when secrets are revealed, relationships are tested, tensions rise, obstacles get more challenging to overcome, and protagonists are really put to the test. In this sequence, the protagonist typically rebels against whatever growth they’re confronted with, wanting instead for things to stay the same.",
  "All of Act Two culminates in this: Sequence Six. Things have steadily gotten more and more difficult for the protagonist, all leading to the Culmination or Low Point. At the end of Sequence Six, the protagonist finds themselves at a point of Culmination (positive) or a Low Point (negative) that directly leads to the next sequence: the Climax.",
  "This is it. The big moment. The massive fight scene. The come-to-Jesus moment where your protagonist must change or die. Everything is on the line and the stakes have never been higher. It all happens in Sequence Seven, and we, the audience, learn whether or not the protagonist “succeeds” or “fails.”",
  "Sequence Eight is the narrative epilogue. It’s what happens to your characters after their success or failure during the climax, including a look at how they have been impacted by that success or failure. In this sequence, the journey we’ve been on since Sequence One comes to an end. And… fade to black.",
];

const ScreenplayEditor = () => {
  const [content, setContent] = useState(() => {
    const savedContent =
      JSON.parse(localStorage.getItem("screenplayContent")).slice(0, 8) ||
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
      .map((c, i) => `\n# ${sections[i]}\n${c}`)
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
                <h3 title={sectionDescriptions[index]}>?</h3>
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
