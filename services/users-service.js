import bcrypt from 'bcryptjs';
import User from '../models/user.js';

import { findSeekerByUserId } from './seekers-service.js';
import { findProviderByUserId } from './providers-service.js';

export const createUser = async (userDetails) => {
  const { email, password, firstName, lastName, userType } = userDetails;
  const hashedPassword = await bcrypt.hash(password, 12);

  const { _doc: user } = await User.create({
    firstName,
    lastName,
    email,
    userType,
    password: hashedPassword,
  });

  return user;
};

export const updateUserById = async (_id, details) => {
  const updatedDetails = { ...details, updatedAt: Date.now() };

  const { _doc: updatedUser } = await User.findOneAndUpdate(
    { _id },
    updatedDetails,
    { upsert: false, runValidators: true, new: true },
  );

  return updatedUser;
};

export const mergeUserDetails = (userOfType, user) => {
  // create an full user object with non-confidential details
  const { firstName, lastName, userType, image } = user;
  const safeDetails = { ...userOfType, firstName, lastName, userType, image };

  return safeDetails;
};

export const mergeAsLoggedUser = (userOfType, user) => {
  const mergedUser = mergeUserDetails(userOfType, user);

  mergedUser.userTypeId = mergedUser._id;
  mergedUser._id = mergedUser.userId;

  delete mergedUser.userId;

  return mergedUser;
};

export const getFullUserById = async (user) => {
  let details;
  if (user.userType === 'seeker') {
    details = await findSeekerByUserId(user._id);
  } else if (user.userType === 'provider') {
    details = await findProviderByUserId(user._id);
  }

  if (details == null) {
    details = { userId: user._id, userType: user.userType };
  }

  const userDetails = mergeAsLoggedUser(details, user);

  return userDetails;
};
