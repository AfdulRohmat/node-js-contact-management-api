import userService from "../services/user-services.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await userService.getUser(username);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    request.username = username;

    const result = await userService.updatetUser(request);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logout(req.user.username);
    res.status(200).json({ data: "OK" });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getUser,
  updateUser,
  logout,
};
