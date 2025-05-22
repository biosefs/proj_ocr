document.getElementById('processImage').addEventListener('click', async () => {
  const image = document.getElementById('imageUpload').files[0];
  const language = document.getElementById('languageSelect').value;

  if (!image) {
    alert('Please upload an image.');
    return;
  }

  if (!image.type.startsWith('image/')) {
    alert('Please upload a valid image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    Tesseract.recognize(reader.result, language, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const progress = Math.round(m.progress * 100);
          document.getElementById('progress').innerText = `Progress: ${progress}%`;
        }
      },
    })
      .then(({ data: { text } }) => {
        document.getElementById('output').innerText = text;
      })
      .catch((error) => {
        document.getElementById('output').innerText = 'Error processing the image. Please try again.';
        console.error(error);
      });
  };
  reader.readAsDataURL(image);
});
