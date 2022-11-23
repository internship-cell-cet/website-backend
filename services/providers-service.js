import Provider from '../models/provider.js';

export const newProviderRegister = async (userId, details) => {
  const { description, website } = details;

  const { _doc: provider } = await Provider.create({
    userId,
    description,
    website,
  });

  return provider;
};

export const findProviderByUserId = async (userId) => {
  const details = await Provider.findOne({ userId });
  const provider = details?._doc;
  return provider;
};

export const updateProviderByUserId = async (userId, details) => {
  const { description, website } = details;

  const { _doc: updatedProvider } = await Provider.findOneAndUpdate(
    { userId },
    {
      description,
      website,
      updatedAt: Date.now(),
    },
    { upsert: false, runValidators: true, new: true },
  );

  return updatedProvider;
};
