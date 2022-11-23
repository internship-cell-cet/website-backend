import { pick } from 'lodash-es';

import Job from '../models/job.js';
import Seeker from '../models/seeker.js';
import User from '../models/user.js';
import Stats from '../models/stats.js';
import Provider from '../models/provider.js';
import { getFullUserById } from './users-service.js';

export const createJob = async (_id, details) => {
  const jobDetails = pick(details, [
    'description',
    'salary',
    'requiredSkills',
    'designation',
    'location',
    'type',
    'experience',
  ]);

  const { _doc: newJob } = await Job.create({
    ...jobDetails,
    providerId: _id,
  });

  return newJob;
};

export const applyJob = async (userId, jobId) => {
  const updatedSeeker = await Seeker.findOneAndUpdate(
    { userId },
    { $push: { jobs: jobId } },
    { upsert: false, runValidators: true, new: true },
  );
  await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { applicants: { $each: [`${updatedSeeker._id}`] } } },
    { upsert: false, runValidators: true, new: true },
  );
  return updatedSeeker;
};

export const getAppliedJobs = async (jobs) => {
  const jobsApplied = await Promise.all(jobs.map((element) => Job.findOne({ _id: element })));
  return jobsApplied;
};

export const findRecentJobs = async () => {
  const recentJobs = await Job.find().sort({ _id: -1 }).limit(10);
  return recentJobs;
};

export const selectApplicantService = async (seekerId, jobId) => {
  let updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $pull: { applicants: { $in: [`${seekerId}`] } } },
    { upsert: false, runValidators: true, new: true },
  );

  updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { selected: { $each: [`${seekerId}`] } } },
    { upsert: false, runValidators: true, new: true },
  );

  return updatedJob;
};

export const hireApplicantService = async (seekerId, jobId) => {
  let updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $pull: { selected: { $in: [`${seekerId}`] } } },
    { upsert: false, runValidators: true, new: true },
  );

  updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { hired: { $each: [`${seekerId}`] } } },
    { upsert: false, runValidators: true, new: true },
  );

  const { providerId } = updatedJob;

  const user = await Provider.findById(providerId);
  const providerDetails = await User.findById({ _id: user.userId });

  await Stats.findOneAndUpdate(
    { providerId: updatedJob.providerId },
    {
      providerId,
      image: providerDetails.image,
      firstName: providerDetails.firstName,
      lastName: providerDetails.lastName,
      $inc: { recruits: 1 },
    },
    { upsert: true, new: true },
  );

  return updatedJob;
};

export const fetchApplicantDetailsService = async (appliedUsers) => {
  const userDetails = await Promise.all(appliedUsers.map(async (users) => {
    const seekerDetails = await Seeker.findById(users);
    const user = await User.findById(seekerDetails.userId);
    return getFullUserById(user);
  }));
  return userDetails;
};

export const searchJobs = async (providerId, skillCode) => {
  let JobDetails = [];
  if (providerId && !skillCode) {
    JobDetails = await Job.find({ providerId });
  } else if (!providerId && skillCode) {
    JobDetails = await Job.find({ requiredSkills: { $in: [skillCode] } });
  } else {
    const providerMatch = await Job.find({ providerId });

    providerMatch.map((job) => {
      if (job.requiredSkills.includes(skillCode)) {
        JobDetails.push(job);
      }
      return null;
    });
  }

  return JobDetails;
};
