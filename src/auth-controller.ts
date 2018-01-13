import * as boom from "boom";
import {Express, Response} from "express";
import {asyncRoute, Request} from "./route-helpers";

export class AuthController {
  constructor(private app: Express) {}

  public registerRoutes(): void {
    this.app.post("/api/auth", this.post);
  }

  private post = asyncRoute(async (req: Request<void, void, {pass: string}>, res: Response): Promise<Response> => {
    if (!req.body.pass) {
      throw boom.notImplemented();
    }

    return res.send();
  });
}
