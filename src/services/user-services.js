import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  loginUserValidation,
  registerUserValidation,
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

export default {
  register,
  login,
};
