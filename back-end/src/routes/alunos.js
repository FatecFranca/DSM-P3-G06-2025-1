import { Router } from 'express';
import controller from '../controllers/alunos.js';

const router = Router();

router.post('/', controller.create);
router.get('/', controller.retrieveAll);
router.get('/:id', controller.retrieveOne);
router.put('/:id', controller.update);
router.put('/:id/plano', controller.updatePlano); // ✅ NOVA ROTA PARA ATUALIZAR O PLANO
router.delete('/:id', controller.delete);

export default router;
