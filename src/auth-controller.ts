import * as boom from "boom";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {Express, Response} from "express";
import {authenticationInfo, asyncRoute, Request} from "./route-helpers";
import {UserRepository} from "./user-repository";
import {User} from "./user";
import otplib = require("otplib");

export class AuthController {
  constructor(private app: Express, private repository: UserRepository) {}

  public registerRoutes(): void {
    this.app.get("/api/permissions", this.getPermissions);
    this.app.post("/api/auth", this.post);
  }

  private getPermissions = authenticationInfo(this.repository, (authInfo) => asyncRoute(async (_req: Request<{user: string}>, res: Response): Promise<Response> => {
    if (!authInfo) {
      throw boom.badRequest("No auth token");
    }

    return res.json({
      admin: authInfo.admin,
      username: authInfo.user.id
    });
  }));

  private post = asyncRoute(async (req: Request<void, void, {username?: string, password?: string, tempToken?: string, authCode?: string}>, res: Response): Promise<Response> => {
    if (req.body) {
      if (req.body.username && req.body.password) {
        const {username, password} = req.body;

        const user = await this.repository.getUser(username);
        const tempToken = await this.getTempToken(user, Buffer.from(password, "base64").toString("utf8"));

        if (!user.authenticatorSecret) {
          let secret = "";
          const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
          for(const value of crypto.randomBytes(16).values()) {
            secret += validChars[Math.floor((value/256) * validChars.length)];
          }
          user.authenticatorSecret = secret;
          await this.repository.storeAuthenticatorSecret(user.id, user.authenticatorSecret);
        }

        return res.json({
          tempToken,
          authenticatorUrl: `otpauth://totp/Xapphire13?secret=${user.authenticatorSecret}`
        });
      } else if (req.body.tempToken && req.body.authCode) {
        const {tempToken, authCode} = req.body;

        const decodedToken = (() => {
          const decodedToken = jwt.decode(tempToken);

          if (!decodedToken) {
            throw boom.unauthorized("Invalid token");
          }

          return decodedToken as {user: string, type: string};
        })();

        const user = await this.repository.getUser(decodedToken.user);
        const authToken = await this.getAuthToken(user, authCode, tempToken);

        return res.json({
          token: authToken
        });
      }
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
