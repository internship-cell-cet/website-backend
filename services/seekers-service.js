import Seeker from '../models/seeker.js';

export const newSeekerRegister = async (userId, details) => {
  const { skills } = details;

  const { _doc: seeker } = await Seeker.create({
    userId,
    skills,
  });

  return seeker;
};

export const findSeekerByUserId = async (userId) => {
  const details = await Seeker.findOne({ userId });
  const seeker = details?._doc;
  return seeker;
};

export const updateSeekerByUserId = async (userId, details) => {
  const { skills } = details;

  const { _doc: updatedSeeker } = await Seeker.findOneAndUpdate(
    { userId },
    {
      skills,
      updatedAt: Date.now(),
    },
    { upsert: false, runValidators: true, new: true },
  );

  return updatedSeeker;
};
