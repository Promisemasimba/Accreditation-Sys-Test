const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const getAllRegistrants = async (req, res) => {
  try {
    const registrants = await prisma.registrant.findMany({
      include: { delegates: true },
    });
    res.json(registrants);
  } catch (error) {
    console.error("Error fetching registrants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRegistrantById = async (req, res) => {
  const { id } = req.params;
  try {
    const registrant = await prisma.registrant.findUnique({
      where: { id: parseInt(id) },
      include: { delegates: true },
    });
    if (!registrant) {
      return res.status(404).json({ error: "Registrant not found" });
    }
    res.json(registrant);
  } catch (error) {
    console.error("Error fetching registrant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createRegistrant = async (req, res) => {
  const { body, file } = req;

  // Log the request body to inspect its contents
  console.log("Request Body:", body);

  try {
    const registrant = await prisma.registrant.create({
      data: {
        ...body,
        profileImage: saveImage(file, body.email),
      },
      include: { delegates: true },
    });

    res.status(201).json(registrant);
  } catch (error) {
    console.error("Error creating registrant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRegistrant = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;

  try {
    const updatedRegistrant = await prisma.registrant.update({
      where: { id: parseInt(id) },
      data: {
        ...body,
        profileImage: saveImage(file, body.email), // Pass the registrant's email to create a folder
      },
      include: { delegates: true },
    });

    res.json(updatedRegistrant);
  } catch (error) {
    console.error("Error updating registrant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to save the image within a folder named after the registrant's email
const saveImage = (file, email) => {
  if (!file) {
    return null;
  }

  const { filename, path: filePath } = file;
  const folderPath = path.join(__dirname, "uploads", email); // Create a folder based on the registrant's email
  const newPath = path.join(folderPath, filename);

  // Ensure the folder exists, and move the file to the specified path
  fs.mkdirSync(folderPath, { recursive: true });
  fs.renameSync(filePath, newPath);

  return newPath.replace(__dirname, ""); // Return the relative path for storage in the database
};

const deleteRegistrant = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRegistrant = await prisma.registrant.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedRegistrant);
  } catch (error) {
    console.error("Error deleting registrant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllRegistrants,
  getRegistrantById,
  createRegistrant,
  updateRegistrant,
  deleteRegistrant,
};
