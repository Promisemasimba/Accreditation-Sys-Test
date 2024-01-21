const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllDelegates = async (req, res) => {
  try {
    const delegates = await prisma.delegate.findMany({ include: { registrant: true } });
    res.json(delegates);
  } catch (error) {
    console.error('Error fetching delegates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDelegateById = async (req, res) => {
  const { id } = req.params;
  try {
    const delegate = await prisma.delegate.findUnique({
      where: { id: parseInt(id) },
      include: { registrant: true },
    });
    if (!delegate) {
      return res.status(404).json({ error: 'Delegate not found' });
    }
    res.json(delegate);
  } catch (error) {
    console.error('Error fetching delegate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllDelegates,
  getDelegateById,
};
