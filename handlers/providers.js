import { pick } from 'lodash-es';
import Provider from '../models/provider.js';
import User from '../models/user.js';

import { newProviderRegister, updateProviderByUserId } from '../services/providers-service.js';
import { updateUserById, mergeAsLoggedUser, getFullUserById } from '../services/users-service.js';

export const providerRegistrationHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const details = pick(req.body, [
      'mobileNum',
      'website',
      'description',
      'address',
    ]);

    const newProvider = await newProviderRegister(userId, details);
    const updatedUser = await updateUserById(userId, details);

    const providerDetails = mergeAsLoggedUser(newProvider, updatedUser);

    return res.json(providerDetails);
  } catch (error) {
    return next(error);
  }
};

export const providerEditHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const details = pick(req.body, [
      'firstName',
      'lastName',
      'mobileNum',
      'website',
      'description',
      'address',
    ]);

    const updatedProvider = await updateProviderByUserId(userId, details);
    const updatedUser = await updateUserById(userId, details);

    const providerDetails = mergeAsLoggedUser(updatedProvider, updatedUser);

    return res.json(providerDetails);
  } catch (error) {
    return next(error);
  }
};

export const fetchProvidersHandler = async (req, res, next) => {
  try {
    const providers = await Provider.find();
    const providerDetails = await Promise.all(providers.map(async (provider) => {
      const user = await User.findById(provider.userId);
      return getFullUserById(user);
    }));
    return res.json(providerDetails);
  } catch (error) {
    return next(error);
  }
};

export const getSeekerResume = async (req, res, next) => {
  try {
    return res.download(req.body.resume);
  } catch (error) {
    return next(error);
  }
};
