import jwt from "jsonwebtoken";
import Token from "../models/Token.js";
import "dotenv/config";
import UserDTO from "../dtos/user-dto.js";
import { MyJwtPayload } from "../models/MyJwtPayload.js";


export type AccessToken = string;
export type RefreshToken = string;
export type UnsubscribeToken = string;


export interface ITokenPayload {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}

class TokenService {
  generateTokens(payload: MyJwtPayload): {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
  } {
    const { id, email } = payload;
    const accessToken = jwt.sign(
      { id, email },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { id, email },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "30d",
      }
    );
    return { accessToken, refreshToken };
  }
  validateAccessToken(token: AccessToken) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token: RefreshToken) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
      return userData;
    } catch (e) {
      return null;
    }
  }
  async saveToken(user: UserDTO, refreshToken: RefreshToken) {
    const existingToken = await Token.findOne({ user: user.id });
    if (existingToken) {
      existingToken.refreshToken = refreshToken;
      return existingToken.save();
    }
    const token = await Token.create({
      user: user.id,
      refreshToken,
    });
    return token;
  }
  async removeToken(refreshToken: RefreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }
  async findToken(refreshToken: RefreshToken) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
  async generateUnsubscribeToken(userId:string, eventId:string) {
   return jwt.sign(
      { userId, eventId,type:"unsubscribe" },
      process.env.JWT_UNSUBSCRIBE_SECRET!,
      { expiresIn: "7d" }
    );
  }
  async verifyUnsubscribeToken(token: UnsubscribeToken): Promise<{ userId: string; eventId: string }> {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_UNSUBSCRIBE_SECRET!
      ) as jwt.JwtPayload;
      return {
        userId: payload.userId,
        eventId: payload.eventId,
      };
    } catch (e) {
      return Promise.reject("Invalid or expired unsubscribe token");
    }
  }
}
export default TokenService;
