import ErrorHandler from "../exeptions/errorHandlung.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mailService from "./mail-service.js";
import UserDTO from "../dtos/user-dto.js";
import TokenService from "./token-service.js";

class AuthService {
  async registration(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ErrorHandler.RegistrationError(
        `User with email ${email} already exists`
      );
    }
    const isAdmin =
      (email === process.env.ADMIN_EMAIL1 &&
        password === process.env.ADMIN_PASSWORD1) ||
      (email === process.env.ADMIN_EMAIL2 &&
        password === process.env.ADMIN_PASSWORD2)
        ? true
        : false;

    const hashedPW = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const activationLink = uuidv4();
    const newUser = await User.create({
      name,
      email,
      password: hashedPW,
      role: isAdmin ? "admin" : "user",
      activationLink: activationLink,
    });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDTO(newUser);
   
    return { user: userDto };
  }

  async activate(activationLink: string) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ErrorHandler.BadRequestError("Ungültiger Aktivierungslink!");
    }
    user.isActivated = true;
    user.activationLink = null;
    await user.save();
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw ErrorHandler.BadRequestError(
        "LOGIN ERROR: Email and password are required!"
      );
    }
    const foundUser = await User.findOne({ email: email }).populate("avatar");
    if (!foundUser)
      throw ErrorHandler.NotFoundError(
        "User with this email address not found!"
      );
    const isMatchPW = await bcrypt.compare(password, foundUser.password);
    if (!isMatchPW) {
      throw ErrorHandler.NotAcceptableError("Invalid login credentials!");
    }
    const userDto = new UserDTO(foundUser);
    const tokenService = new TokenService();
    const tokens = tokenService.generateTokens(userDto.toPayload());
    await tokenService.saveToken(userDto, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
  async logout(refreshToken: string) {
    const tokenService = new TokenService();
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ErrorHandler.UnauthorizedError("User is not authorized!");
    }
    const tokenService = new TokenService();
    const userData = tokenService.validateRefreshToken(refreshToken);
    if (typeof userData === "string") {
      throw new Error("Invalid token payload");
    }

    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ErrorHandler.UnauthorizedError("User is not authorized!");
    }
    // Find user ,because userdata for 30d can be changed
    const user = await User.findById(userData.id).populate("avatar");

    if (!user) {
      throw ErrorHandler.NotFoundError("User not found!");
    }
    const userDto = new UserDTO(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

const authService = new AuthService();
export default authService;
