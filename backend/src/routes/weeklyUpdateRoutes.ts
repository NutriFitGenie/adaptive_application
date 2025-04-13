import { Router } from 'express';
import { getUpdatedPlan } from '../controllers/weeklyUpdatesController';

const router = Router();

// router.post('/weeklyplan', createWeeklyPlan);
// router.get('/weeklyplan/:userId', getWeeklyPlansByUser);
// router.post('/weeklyprogress', submitWeeklyProgress);
router.post('/weeklyprogress/:userId', getUpdatedPlan);

export default router;