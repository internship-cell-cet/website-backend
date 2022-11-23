import express from 'express';

import { seekerRegistrationHandler, seekerEditHandler, resumeUpload, seekerSearchHandler } from '../handlers/seekers.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.post('/register', seekerRegistrationHandler);
router.post('/upload-resume', upload.single('resume'), resumeUpload);
router.post('/edit', seekerEditHandler);
router.post('/search', seekerSearchHandler);

export default router;
