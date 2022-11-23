import userRoutes from './user.js';
import seekersRoutes from './seekers.js';
import providersRoutes from './providers.js';
import jobsRoutes from './jobs.js';
import skillsRoutes from './skills.js';
import neutralRoutes from './neutral.js';
import checkAuth from '../config/auth.js';

const useRoute = (app) => {
  app.use('/user', userRoutes);
  app.use('/neutral', neutralRoutes);
  app.use('/auth/*', checkAuth);
  app.use('/skills', skillsRoutes);
  app.use('/auth/users', userRoutes);
  app.use('/seekers', seekersRoutes);
  app.use('/auth/seekers', seekersRoutes);
  app.use('/auth/providers', providersRoutes);
  app.use('/providers', providersRoutes);
  app.use('/auth/jobs', jobsRoutes);
  app.use('/jobs', jobsRoutes);
};

export default useRoute;
