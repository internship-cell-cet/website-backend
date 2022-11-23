import { v2 } from 'cloudinary';
import { pick } from 'lodash-es';
import Seeker from '../models/seeker.js';

import { newSeekerRegister, updateSeekerByUserId } from '../services/seekers-service.js';
import { updateUserById, mergeAsLoggedUser } from '../services/users-service.js';
import { searchJobs } from '../services/jobs-service.js';

export const seekerRegistrationHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const details = pick(req.body, [
      'skills',
      'dob',
      'mobileNum',
    ]);

    const newSeeker = await newSeekerRegister(userId, details);
    const updatedUser = await updateUserById(userId, details);

    const seekerDetails = mergeAsLoggedUser(newSeeker, updatedUser);

    return res.json(seekerDetails);
  } catch (error) {
    return next(error);
  }
};

export const seekerEditHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const details = pick(req.body, [
      'firstName',
      'lastName',
      'skills',
      'dob',
      'mobileNum',
    ]);

    const updatedSeeker = await updateSeekerByUserId(userId, details);
    const updatedUser = await updateUserById(userId, details);

    const seekerDetails = mergeAsLoggedUser(updatedSeeker, updatedUser);

    return res.json(seekerDetails);
  } catch (error) {
    return next(error);
  }
};

export const resumeUpload = async (req, res, next) => {
  const data = { resume: req.file.path };
  try {
    console.log(req.user);
    console.log(data.resume);
    const uploadedResume = await v2.uploader.upload(data.resume);
    console.log(req.user);
    console.log(uploadedResume);
    await Seeker.findOneAndUpdate(
      { userId: req.user._id },
      { resume: uploadedResume.url },
    );
    return res.json({ resume: uploadedResume.url });
  } catch (error) {
    return next(error);
  }
};

export const seekerSearchHandler = async (req, res, next) => {
  try {
    const { providerId, skillCode } = req.body;
    const searchResults = await searchJobs(providerId, skillCode);

    return res.json(searchResults);
  } catch (error) {
    return next(error);
  }
};
