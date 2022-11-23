import Stats from '../models/stats.js';

export const neutralHandler = async (req, res, next) => {
  try {
    const statData = await Stats.find();
    let totalRecruits = 0;
    statData.map((stat) => {
      totalRecruits += stat.recruits;
      return null;
    });
    statData.sort((a, b) => ((a.recruits > b.recruits) ? -1 : 1));
    return res.json({ totalRecruits, statData });
  } catch (error) {
    return next(error);
  }
};
