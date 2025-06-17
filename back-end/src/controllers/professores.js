import prisma from '../database/client.js';

const controller = {};

controller.create = async function(req, res) {
  try {
    // Verifica se já existe professor com o mesmo CPF
    const exists = await prisma.professores.findUnique({ where: { cpf: req.body.cpf } });
    if (exists) return res.status(409).json({ success: false, message: 'CPF já cadastrado' });
    const novo = await prisma.professores.create({ data: req.body });
    res.status(201).json(novo);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.professores.findMany();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.professores.findUnique({
      where: { id: req.params.id },
    });
    if (result) res.send(result);
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.update = async function(req, res) {
  try {
    await prisma.professores.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(204).end();
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end();
    } else {
      console.error(error);
      res.status(500).send(error);
    }
  }
};

controller.delete = async function(req, res) {
  try {
    await prisma.professores.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end();
    } else {
      console.error(error);
      res.status(500).send(error);
    }
  }
};

export default controller;