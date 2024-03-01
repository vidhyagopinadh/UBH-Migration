const pdfFormat = ["application/pdf"];
const imageFormat = [
  "image/png",
  "image/jpeg",
  "image/apng",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "image/webp",
];
const imagePdfFormat = imageFormat.concat(pdfFormat);
export { imageFormat, imagePdfFormat, pdfFormat };
