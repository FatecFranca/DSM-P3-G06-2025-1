import prisma from '../database/client.js';

const controller = {};

controller.create = async function(req, res) {
  try {
    // Verifica se já existe aluno com o mesmo CPF
    const exists = await prisma.aluno.findUnique({ where: { cpf: req.body.cpf } });
    if (exists) return res.status(409).json({ success: false, message: 'CPF já cadastrado' });
    await prisma.aluno.create({ data: req.body });
    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.aluno.findMany();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.aluno.findUnique({
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
    await prisma.aluno.update({
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
    await prisma.aluno.delete({
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

controller.login = async function(req, res) {
  try {
    const { cpf, senha } = req.body;
    const aluno = await prisma.aluno.findUnique({ where: { cpf } });
    if (!aluno) return res.status(401).json({ success: false, message: 'Aluno não encontrado' });
    if (aluno.senha !== senha) return res.status(401).json({ success: false, message: 'Senha incorreta' });
    res.json({ success: true, user: { nome: aluno.nome, tipo: 'aluno', id: aluno.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no login', error });
  }
};

export default controller;