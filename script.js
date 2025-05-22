document.getElementById('processImage').addEventListener('click', async () => {
  const image = document.getElementById('imageUpload').files[0];
  const language = document.getElementById('languageSelect').value;

  console.log("Button clicked!");
  console.log("Selected language:", language);

  if (!image) {
    alert('Please upload an image.');
    console.log("No image uploaded.");
    return;
  }

  if (!image.type.startsWith('image/')) {
    alert('Please upload a valid image file.');
    console.log("Invalid file type:", image.type);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    console.log("Image loaded successfully.");

    Tesseract.recognize(reader.result, language, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const progress = Math.round(m.progress * 100);
          document.getElementById('progress').innerText = `Progress: ${progress}%`;
          console.log("Progress:", progress, "%");
        }
      },
    })
      .then(({ data: { text } }) => {
        const cleanedText = cleanText(text);
        document.getElementById('output').innerText = cleanedText;
        console.log("OCR output (cleaned):", cleanedText);
      })
      .catch((error) => {
        document.getElementById('output').innerText = 'Error processing the image. Please try again.';
        console.error("OCR Error:", error);
      });
  };
  reader.onerror = (error) => {
    console.error("FileReader Error:", error);
  };
  reader.readAsDataURL(image);
});

/**
 * Function to clean and format OCR text.
 * - Removes extra spaces and newlines.
 * - Ensures text is readable and well-structured.
 */
function cleanText(text) {
  return text
    .replace(/(\S)\n(\S)/g, "$1 $2") // Joins lines with a single line break
    .replace(/\s{2,}/g, " ") // Replaces multiple spaces with one
    .replace(/\n{2,}/g, "\n") // Ensures only one newline for paragraphs
    .replace(/—/g, "-") // Replaces em dash with a regular dash
    .trim(); // Removes leading and trailing whitespace
}
