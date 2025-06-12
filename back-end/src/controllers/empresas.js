import prisma from '../database/client.js';

const controller = {};

controller.create = async function(req, res) {
  try {
    // Verifica se já existe empresa com o mesmo CNPJ
    const exists = await prisma.empresas.findUnique({ where: { cnpj: req.body.cnpj } });
    if (exists) return res.status(409).json({ success: false, message: 'CNPJ já cadastrado' });
    await prisma.empresas.create({ data: req.body });
    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.empresas.findMany();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.empresas.findUnique({
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
    await prisma.empresas.update({
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
    await prisma.empresas.delete({
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
    const { cnpj, senha } = req.body;
    const empresa = await prisma.empresas.findUnique({ where: { cnpj } });
    if (!empresa) return res.status(401).json({ success: false, message: 'Empresa não encontrada' });
    if (empresa.senha !== senha) return res.status(401).json({ success: false, message: 'Senha incorreta' });
    res.json({ success: true, user: { nome: empresa.nome, tipo: 'empresa', id: empresa.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no login', error });
  }
};

export default controller;