import express from 'express';
import { ReportsController } from '../controller';

const router = express.Router();

router.route('/campaign/:campaign_id/pause').post(ReportsController.pauseCampaign);
router.route('/campaign/:campaign_id/resume').post(ReportsController.resumeCampaign);
router.route('/campaign').get(ReportsController.listCampaigns);

export default router;