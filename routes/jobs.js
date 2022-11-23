import express from 'express';

import { appliedJobsHandler, applyJobHandler, createJobHandler, fetchApplicantDetails, hireApplicant, providedJobsHandler, recentJobsHandler, selectApplicant } from '../handlers/jobs.js';

const router = express.Router();

router.post('/create-job', createJobHandler);
router.post('/apply-job', applyJobHandler);
router.post('/select-applicant', selectApplicant);
router.post('/hire-applicant', hireApplicant);
router.post('/fetch-applicants', fetchApplicantDetails);
router.get('/jobs-provided', providedJobsHandler);
router.get('/jobs-applied', appliedJobsHandler);
router.get('/recent-jobs', recentJobsHandler);

export default router;
