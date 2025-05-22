document.getElementById('processImage').addEventListener('click', async () => {
  const image = document.getElementById('imageUpload').files[0];
  if (!image) {
    alert('Please upload an image.');
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const { data: { text } } = await Tesseract.recognize(reader.result, 'eng');
    document.getElementById('output').innerText = text;
  };
  reader.readAsDataURL(image);
});
