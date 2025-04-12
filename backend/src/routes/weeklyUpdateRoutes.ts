import { Router } from 'express';
import { createWeeklyPlan, getWeeklyPlansByUser, getWeeklyProgressByUser, submitWeeklyProgress } from '../controllers/weeklyUpdatesController';

const router = Router();

router.post('/weeklyplan', createWeeklyPlan);
router.get('/weeklyplan/:userId', getWeeklyPlansByUser);
router.post('/weeklyprogress', submitWeeklyProgress);
router.get('/weeklyprogress/:userId', getWeeklyProgressByUser);

export default router;