import * as boom from "boom";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {Express, Response} from "express";
import {asyncRoute, Request} from "./route-helpers";
import {AuthRepository} from "./auth-repository";

export class AuthController {
  constructor(private app: Express, private repository: AuthRepository) {}

  public registerRoutes(): void {
    this.app.post("/api/auth", this.post);
  }

  private post = asyncRoute(async (req: Request<void, void, {pass: string}>, res: Response): Promise<Response> => {
    if (req.body.pass) {
      const password = Buffer.from(req.body.pass, "base64").toString("utf8");
      const token = await this.getTempToken(password);

      return res.json(token);
    }

    throw boom.notImplemented();
  });

  private async getTempToken(password: string): Promise<string> {
    const admin = await this.repository.getAdmin();

    if (!admin.passwordHash) { // No password set, set it
      admin.passwordHash = await bcrypt.hash(password, 10);
      await this.repository.storePasswordHash(admin.id, admin.passwordHash);
    } else if (!await bcrypt.compare(password, admin.passwordHash)) { // Password set, check it
      throw boom.unauthorized("Incorrect password");
    }

    // Password is good, generate temporary token
    const secret = crypto.randomBytes(32).toString("hex");
    return jwt.sign({
      type: "temporary",
      user: admin.id
    }, secret, {
      expiresIn: "10m"
    });
  }
}
