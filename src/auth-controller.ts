import * as boom from "boom";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {Express, Response} from "express";
import {asyncRoute, Request} from "./route-helpers";
import {AuthRepository} from "./auth-repository";
import {User} from "./user";
import otplib = require("otplib");

export class AuthController {
  constructor(private app: Express, private repository: AuthRepository) {}

  public registerRoutes(): void {
    this.app.post("/api/auth", this.post);
  }

  private post = asyncRoute(async (req: Request<void, void, {pass: string, token: string, authCode: string}>, res: Response): Promise<Response> => {
    const {authCode, pass, token} = req.body;


    if (pass) {
      const admin = await this.repository.getAdmin();
      const password = Buffer.from(pass, "base64").toString("utf8");
      const tempToken = await this.getTempToken(admin, password);

      if (!admin.authenticatorSecret) {
        let secret = "";
        const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
        for(const value of crypto.randomBytes(16).values()) {
          secret += validChars[Math.floor((value/256) * validChars.length)];
        }
        admin.authenticatorSecret = secret;
        await this.repository.storeAuthenticatorSecret(admin.id, admin.authenticatorSecret);
      }

      return res.json({
        token: tempToken,
        authenticatorUrl: `otpauth://totp/Xapphire13?secret=${admin.authenticatorSecret}`
      });
    } else if (authCode && token) {
      const admin = await this.repository.getAdmin();
      const authToken = await this.getAuthToken(admin, authCode, token);

      return res.json({
        token: authToken
      });
    }

    throw boom.badRequest();
  });

  private async getAuthToken(user: User, authCode: string, tempToken: string): Promise<string> {
    const token = new Promise<string | object>((res, rej) => jwt.verify(tempToken, user.tokenSecret, (err, valid) => err ? rej(err) : res(valid)));
    const authCodeValid = otplib.authenticator.check(authCode, user.authenticatorSecret);
    const tokenValid = await token.then(() => true, () => false);

    if (!authCodeValid || !tokenValid) {
      throw boom.unauthorized("Invalid code/token");
    }

    return new Promise<string>((res, rej) => jwt.sign({
      type: "auth",
      user: user.id
    }, user.tokenSecret, {
      expiresIn: "30d"
    }, (err, token) => err ? rej(err) : res(token)));
  }

  private async getTempToken(user: User, password: string): Promise<string> {
    if (!user.passwordHash) { // No password set, set it
      user.passwordHash = await bcrypt.hash(password, 10);
      await this.repository.storePasswordHash(user.id, user.passwordHash);
    } else if (!await bcrypt.compare(password, user.passwordHash)) { // Password set, check it
      throw boom.unauthorized("Incorrect password");
    }

    // Password is good, generate temporary token

    if (!user.tokenSecret) {
      user.tokenSecret = crypto.randomBytes(32).toString("hex");
      await this.repository.storeTokenSecret(user.id, user.tokenSecret);
    }

    return new Promise<string>((res, rej) => jwt.sign({
      type: "temporary",
      user: user.id
    }, user.tokenSecret, {
      expiresIn: "10m"
    }, (err, token) => err ? rej(err) : res(token)));
  }
}
