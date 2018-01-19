// import * as boom from "boom";
// import * as crypto from "crypto";
// import * as jwt from "jsonwebtoken";
// import * as bcrypt from "bcrypt";
// import {Application} from "express";
// import {UserRepository} from "./user-repository";
// import {User} from "./user";
// import {ApiController, route, HttpMethod, RouteHandlerParams} from "./api-controller";
// import otplib = require("otplib");
//
// export class AuthController extends ApiController {
//   constructor(app: Application, private repository: UserRepository) {
//     super(app);
//   }
//
//   @route("permissions", HttpMethod.GET)
//   public async getPermissions({authInfo}: RouteHandlerParams): Promise<{username: string, admin: boolean}> {
//     if (!authInfo) {
//       throw boom.badRequest("No auth token");
//     }
//
//     const user = await this.repository.getUser(authInfo.username);
//     const isAdmin = await this.repository.isAdmin(user.id);
//
//     return {
//       username: authInfo.username,
//       admin: isAdmin
//     };
//   }
//
//   @route("auth", HttpMethod.POST)
//   public async post({req}: RouteHandlerParams<void, void, {username?: string, password?: string, challenge?: string, challengeResponse?: string}>): Promise<{authenticatorUrl?: string, challenge?: string, token?: string}> {
//     if (req.body) {
//       if (req.body.username && req.body.password) {
//         const {username, password} = req.body;
//
//         const user = await this.repository.getUser(username);
//         const tempToken = await this.getTempToken(user, Buffer.from(password, "base64").toString("utf8"));
//         const sendAuthenticatorUrl = !user.authenticatorSecret;
//
//         if (!user.authenticatorSecret) {
//           let secret = "";
//           const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
//           for(const value of crypto.randomBytes(16).values()) {
//             secret += validChars[Math.floor((value/256) * validChars.length)];
//           }
//           user.authenticatorSecret = secret;
//           await this.repository.storeAuthenticatorSecret(user.id, user.authenticatorSecret);
//         }
//
//         return {
//           challenge: tempToken,
//           authenticatorUrl: sendAuthenticatorUrl ? `otpauth://totp/Xapphire13?secret=${user.authenticatorSecret}` : undefined
//         };
//       } else if (req.body.challenge && req.body.challengeResponse) {
//         const {challenge, challengeResponse} = req.body;
//
//         const decodedToken = (() => {
//           const decodedToken = jwt.decode(challenge);
//
//           if (!decodedToken) {
//             throw boom.unauthorized("Invalid token");
//           }
//
//           return decodedToken as {username: string, type: string};
//         })();
//
//         const user = await this.repository.getUser(decodedToken.username);
//         const authToken = await this.getAuthToken(user, challengeResponse, challenge);
//
//         return {
//           token: authToken
//         };
//       }
//     }
//
//     throw boom.badRequest();
//   };
//
//   private async getAuthToken(user: User, authCode: string, tempToken: string): Promise<string> {
//     const token = new Promise<string | object>((res, rej) => jwt.verify(tempToken, user.tokenSecret, (err, valid) => err ? rej(err) : res(valid)));
//     const authCodeValid = otplib.authenticator.check(authCode, user.authenticatorSecret);
//     const tokenValid = await token.then(() => true, () => false);
//
//     if (!authCodeValid || !tokenValid) {
//       throw boom.unauthorized("Invalid code/token");
//     }
//
//     return new Promise<string>((res, rej) => jwt.sign({
//       type: "auth",
//       username: user.username
//     }, user.tokenSecret, {
//       expiresIn: "30d"
//     }, (err, token) => err ? rej(err) : res(token)));
//   }
//
//   private async getTempToken(user: User, password: string): Promise<string> {
//     if (!user.passwordHash) { // No password set, set it
//       user.passwordHash = await bcrypt.hash(password, 10);
//       await this.repository.storePasswordHash(user.id, user.passwordHash);
//     } else if (!await bcrypt.compare(password, user.passwordHash)) { // Password set, check it
//       throw boom.unauthorized("Incorrect username/password");
//     }
//
//     // Password is good, generate temporary token
//
//     if (!user.tokenSecret) {
//       user.tokenSecret = crypto.randomBytes(32).toString("hex");
//       await this.repository.storeTokenSecret(user.id, user.tokenSecret);
//     }
//
//     return new Promise<string>((res, rej) => jwt.sign({
//       type: "temporary",
//       username: user.username
//     }, user.tokenSecret, {
//       expiresIn: "10m"
//     }, (err, token) => err ? rej(err) : res(token)));
//   }
// }
