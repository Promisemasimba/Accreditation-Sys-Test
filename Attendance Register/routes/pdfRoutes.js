// server/routes/pdfRoutes.js
const express = require("express");
const router = express.Router();
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs").promises;
const QRCode = require("qrcode");

router.post("/replaceTextAndQRCode", async (req, res) => {
  try {
    const { inputPath, outputPath } = req.body;
    const pdfBytes = await fs.readFile(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Replace text in specific parts of the PDF
    pages.forEach((page) => {
      const textToReplace = {
        "Justice BH Mbha": "New Text 1",
        "Retired Justice of South Africa the Supreme Court of Appeal and immediate past Chairperson of the Electoral Court of South Africa":
          "New Text 2",
        "South Africa": "New Text 3",
      };

      for (const [searchText, replacementText] of Object.entries(
        textToReplace
      )) {
        const matches = page
          .getTextContent()
          .items.filter((item) => item.str.includes(searchText));

        matches.forEach((match) => {
          const { x, y } = match.transform;
          page.drawText(replacementText, {
            x,
            y,
            font: match.fontName,
            fontSize: match.fontSize,
            color: rgb(0, 0, 0),
          });
        });
      }
    });

    // Replace QR code
    const qrCodeData = req.body.qrCodeData;
    const qrCodeImageBuffer = await QRCode.toBuffer(qrCodeData);

    pages.forEach((page) => {
      page.getImages().forEach((image) => {
        // Assuming the QR code is an image, you can replace it based on some condition
        if (image.size.width > 50 && image.size.height > 50) {
          page.removeImage(image);

          const newImage = pdfDoc.embedPng(qrCodeImageBuffer);
          page.drawImage(newImage, {
            x: image.x,
            y: image.y,
            width: image.size.width,
            height: image.size.height,
          });
        }
      });
    });

    const modifiedPdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, modifiedPdfBytes);

    // Send the modified PDF for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=modified_a.pdf");
    res.send(modifiedPdfBytes);
  } catch (error) {
    console.error("Error replacing text and QR code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
