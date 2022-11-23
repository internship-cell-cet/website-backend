import express from 'express';

import { signupHandler, signinHandler, isAuthenticated, imageUpload } from '../handlers/user.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.get('/isAuthenticated', isAuthenticated);
router.post('/signup', signupHandler);
router.post('/signin', signinHandler);
router.post('/upload-image', upload.single('image'), imageUpload);

export default router;
