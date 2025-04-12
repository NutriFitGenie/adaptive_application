import express from 'express';
import {getRecommendations, trackProgress, trackRecipeChoice} from '../controllers/recommenderController';

const router = express.Router();

router.get('/:userId', getRecommendations,);
router.post('/progress', trackProgress);
router.post('/track-choice', trackRecipeChoice);

export default router;