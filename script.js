document.getElementById("scan-button").addEventListener("click", () => {
  const fileInput = document.getElementById("file-input");
  const output = document.getElementById("output");

  if (fileInput.files.length === 0) {
    output.textContent = "Please select an image.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    Tesseract.recognize(reader.result, "eng")
      .then(({ data: { text } }) => {
        const cleanedText = cleanText(text);
        output.textContent = cleanedText;
      })
      .catch((error) => {
        output.textContent = "Error during OCR: " + error.message;
      });
  };

  reader.readAsDataURL(file);
});

function cleanText(text) {
  const mainBody = extractMainBody(text);

  return mainBody
    .replace(/(\S)\n(\S)/g, "$1 $2") // Joins lines with a single line break
    .replace(/\s{2,}/g, " ") // Replaces multiple spaces with one
    .replace(/—/g, "-") // Replaces em dash with a regular dash
    .trim(); // Removes leading and trailing whitespace
}

function extractMainBody(text) {
  const lines = text.split("\n");
  const mainBody = [];
  let inBody = false;

  lines.forEach((line) => {
    if (!inBody && isStartOfMainBody(line)) {
      inBody = true;
    }

    if (inBody) {
      mainBody.push(line.trim());
    }

    if (inBody && isEndOfMainBody(line)) {
      inBody = false;
    }
  });

  return mainBody.join(" ").replace(/\s+/g, " ").trim();
}

function isStartOfMainBody(line) {
  return /\d+\./.test(line) || line.length > 20;
}

function isEndOfMainBody(line) {
  return line.length < 10 && !/\d/.test(line);
}
