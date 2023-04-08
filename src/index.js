import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

// Create a new editor instance
const editor = monaco.editor.create(document.getElementById("editor"), {
  value: 'function hello() {\n  console.log("Hello, world!");\n}',
  language: "javascript",
  theme: "vs-dark",
});

// Log the editor contents to the console whenever the user types
editor.onDidChangeModelContent(() => {
  console.log(editor.getValue());
});
