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
      tessedit_char_whitelist: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", // Improves text filtering
    })
      .then(({ data: { text } }) => {
        document.getElementById('output').innerText = text;
        console.log("OCR output:", text);
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
