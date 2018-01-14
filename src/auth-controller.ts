import * as boom from "boom";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {Express, Response} from "express";
import {asyncRoute, Request} from "./route-helpers";
import {AuthRepository} from "./auth-repository";
import {User} from "./user";

export class AuthController {
  constructor(private app: Express, private repository: AuthRepository) {}

  public registerRoutes(): void {
    this.app.post("/api/auth", this.post);
  }

  private post = asyncRoute(async (req: Request<void, void, {pass: string}>, res: Response): Promise<Response> => {
    if (req.body.pass) {
      const password = Buffer.from(req.body.pass, "base64").toString("utf8");
      const admin = await this.repository.getAdmin();
      const tempToken = await this.getTempToken(admin, password);

      return res.json({
        tempToken,
        authenticatorUrl: `otpauth://totp/Xapphire13?secret=${admin.tokenSecret}`
      });
    }

    throw boom.notImplemented();
  });

  private async getTempToken(user: User, password: string): Promise<string> {
    if (!user.passwordHash) { // No password set, set it
      user.passwordHash = await bcrypt.hash(password, 10);
      await this.repository.storePasswordHash(user.id, user.passwordHash);
    } else if (!await bcrypt.compare(password, user.passwordHash)) { // Password set, check it
      throw boom.unauthorized("Incorrect password");
    }

    // Password is good, generate temporary token

    if (!user.tokenSecret) {
      const secret = crypto.randomBytes(32).toString("hex");
      user.tokenSecret = secret;
      await this.repository.storeSecret(user.id, secret);
    }

    return jwt.sign({
      type: "temporary",
      user: user.id
    }, user.tokenSecret, {
      expiresIn: "10m"
    });
  }
}
