import Skill from '../models/skill.js';

export const getSkillsHandler = async (req, res, next) => {
  try {
    const skills = await Skill.find({}, { __v: 0 }, { sort: { category: 1 } });
    return res.json(skills);
  } catch (error) {
    return next(error);
  }
};
