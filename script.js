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
    // Create an image element
    const img = new Image();
    img.onload = () => {
      // Create a canvas to preprocess the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Convert to grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);

      // Use the preprocessed image for OCR
      Tesseract.recognize(canvas.toDataURL(), language, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            document.getElementById('progress').innerText = `Progress: ${progress}%`;
            console.log("Progress:", progress, "%");
          }
        },
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
    img.src = reader.result;
  };
  reader.onerror = (error) => {
    console.error("FileReader Error:", error);
  };
  reader.readAsDataURL(image);
});
