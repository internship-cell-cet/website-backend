import { v2 } from 'cloudinary';
import passport from 'passport';

import User from '../models/user.js';
import { createUser, getFullUserById } from '../services/users-service.js';

export const signinHandler = async (req, res, next) => {
  await passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    return req.logIn(user, async (error) => {
      if (error) {
        return next(info);
      }

      const userDetails = await getFullUserById(user);
      // @TODO -  send a redirect message with a status code 307
      // @TODO - add a unique status code inside the response data
      return res.json(userDetails);
    });
  })(req, res, next);
};

export const signupHandler = async (req, res, next) => {
  try {
    const { userType, email, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists!' });
    }

    await createUser(req.body);

    return passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err);
      }

      return req.logIn(user, (error) => {
        if (error) {
          return next(error);
        }
        return res.status(200).json({ id: user._id, userType, firstName, lastName });
      });
    })(req, res, next);
  } catch (error) {
    return next(error);
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const user = {
      _id: req.user._id,
      userType: req.user.userType,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      image: req.user.image,
    };
    const userDetails = await getFullUserById(user);
    return res.json(userDetails);
  } catch (error) {
    return next(error);
  }
};

export const imageUpload = async (req, res, next) => {
  const data = { image: req.file.path };
  try {
    console.log(req.user);
    const uploadedImage = await v2.uploader.upload(data.image);
    console.log(req.user);
    console.log(uploadedImage);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { image: uploadedImage.url },
    );
    return res.json({ image: uploadedImage.url });
  } catch (error) {
    return next(error);
  }
};
