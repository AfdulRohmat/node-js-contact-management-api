import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const userFromValidation = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: userFromValidation.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "username already exist");
  }

  // hash password
  userFromValidation.password = await bcrypt.hash(
    userFromValidation.password,
    10
  );

  // Create User
  return prismaClient.user.create({
    data: userFromValidation,
    // return data as response
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });
  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const token = uuid().toString();
  return prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

const getUser = async (username) => {
  username = validate(getUserValidation, username);

  const user = prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  return user;
};

const updatetUser = async (request) => {
  const userFromValidation = validate(updateUserValidation, request);
  const totalUserInDatabase = await prismaClient.user.count({
    where: {
      username: userFromValidation.username,
    },
  });
  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "user is not found");
  }
  const dataUpdate = {};
  if (userFromValidation.name) {
    dataUpdate.name = userFromValidation.name;
  }
  if (userFromValidation.password) {
    dataUpdate.password = await bcrypt.hash(userFromValidation.password, 10);
  }

  return prismaClient.user.update({
    where: { username: userFromValidation.username },
    data: dataUpdate,
    select: {
      username: true,
      name: true,
    },
  });
};

const logout = async (username) => {
  username = validate(getUserValidation, username);
  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    throw new ResponseError(404, "user is not found");
  }
  return prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

export default {
  register,
  login,
  getUser,
  updatetUser,
  logout,
};
