import { IRouter, Router } from 'express';
import { submit, status, metrics } from '../controller/job.controller.js';

const router: IRouter = Router();

router.post('/submit', submit);
router.get('/status/:id', status);
router.get('/metrics', metrics);

export default router;
