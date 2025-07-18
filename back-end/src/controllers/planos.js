import prisma from '../database/client.js';

const controller = {};

controller.assinar = async function (req, res) {
  try {
    await prisma.aluno.update({
      where: { idAluno: req.body.idAluno },
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
}

controller.create = async function (req, res) {
  try {
    await prisma.planos.create({ data: req.body });
    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveAll = async function (req, res) {
  try {
    const result = await prisma.planos.findMany();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    const result = await prisma.planos.findUnique({
      where: { id: req.params.id },
    });
    if (result) res.send(result);
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.update = async function (req, res) {
  try {
    await prisma.planos.update({
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

controller.delete = async function (req, res) {
  try {
    await prisma.planos.delete({
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