import Job from '../models/job.js';
import { applyJob, createJob, fetchApplicantDetailsService, findRecentJobs, getAppliedJobs, hireApplicantService, selectApplicantService } from '../services/jobs-service.js';
import { findProviderByUserId } from '../services/providers-service.js';
import { findSeekerByUserId } from '../services/seekers-service.js';
import { getFullUserById } from '../services/users-service.js';

export const createJobHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const provider = await findProviderByUserId(userId);

    const newJob = await createJob(provider._id, req.body);
    return res.json(newJob);
  } catch (error) {
    return next(error);
  }
};

export const applyJobHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await applyJob(userId, req.body.jobId);
    const updatedSeeker = await getFullUserById(req.user);

    return res.json(updatedSeeker);
  } catch (error) {
    return next(error);
  }
};

export const providedJobsHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const provider = await findProviderByUserId(userId);

    const jobs = await Job.find({ providerId: provider._id });

    return res.json(jobs);
  } catch (error) {
    return next(error);
  }
};

export const appliedJobsHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const seeker = await findSeekerByUserId(userId);

    const appliedJobs = await getAppliedJobs(seeker.jobs);

    return res.json(appliedJobs);
  } catch (error) {
    return next(error);
  }
};

export const recentJobsHandler = async (req, res, next) => {
  try {
    const recentJobs = await findRecentJobs();
    return res.json(recentJobs);
  } catch (error) {
    return next(error);
  }
};

export const selectApplicant = async (req, res, next) => {
  try {
    const { seekerId, jobId } = req.body;
    const updatedJob = await selectApplicantService(seekerId, jobId);
    return res.json(updatedJob);
  } catch (error) {
    return next(error);
  }
};

export const hireApplicant = async (req, res, next) => {
  try {
    const { seekerId, jobId } = req.body;

    const updatedJob = await hireApplicantService(seekerId, jobId);

    return res.json(updatedJob);
  } catch (error) {
    return next(error);
  }
};

export const fetchApplicantDetails = async (req, res, next) => {
  try {
    const appliedUsers = req.body;

    const userDetails = await fetchApplicantDetailsService(appliedUsers);

    return res.json(userDetails);
  } catch (error) {
    return next(error);
  }
};
