import {Router} from 'express';
import controller from '../controllers/planos.js';

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.put('/assinar/:id/aluno/:idaluno/', controller.assinar)



export default router