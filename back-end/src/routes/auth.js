import { Router } from 'express';
import prisma from '../database/client.js';
import bcrypt from 'bcrypt';

const router = Router();

// Login Aluno
router.post('/login/aluno', async (req, res) => {
  const { cpf, senha } = req.body;
  try {
    const aluno = await prisma.aluno.findUnique({ where: { cpf } });
    if (!aluno) return res.status(401).json({ success: false, message: 'Aluno não encontrado' });
    if (aluno.senha !== senha) return res.status(401).json({ success: false, message: 'Senha incorreta' });
    res.json({ success: true, user: { nome: aluno.nome, tipo: 'aluno', id: aluno.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no login', error });
  }
});

// Login Empresa
router.post('/login/empresa', async (req, res) => {
  const { cnpj, senha } = req.body;
  try {
    const empresa = await prisma.empresas.findUnique({ where: { cnpj } });
    if (!empresa) return res.status(401).json({ success: false, message: 'Empresa não encontrada' });
    if (empresa.senha !== senha) return res.status(401).json({ success: false, message: 'Senha incorreta' });
    res.json({ success: true, user: { nome: empresa.nome, tipo: 'empresa', id: empresa.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no login', error });
  }
});

// Cadastro Aluno
router.post('/register/aluno', async (req, res) => {
  try {
    const novo = await prisma.aluno.create({ data: req.body });
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno', error });
  }
});

// Cadastro Empresa
router.post('/register/empresa', async (req, res) => {
  try {
    const novo = await prisma.empresas.create({ data: req.body });
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao cadastrar empresa', error });
  }
});

export default router;
