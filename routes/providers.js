import express from 'express';

import { providerRegistrationHandler, providerEditHandler, fetchProvidersHandler, getSeekerResume } from '../handlers/providers.js';

const router = express.Router();

router.post('/register', providerRegistrationHandler);
router.post('/edit', providerEditHandler);
router.get('/fetch-providers', fetchProvidersHandler);
router.post('/resume-download', getSeekerResume);

export default router;
