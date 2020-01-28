import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post
} from 'routing-controllers';
import Boom from 'boom';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../repositories/UserRepository';
import User from '../entities/user';

import otplib = require('otplib');

@injectable()
@JsonController('/api')
export class AuthController {
  constructor(@inject('UserRepository') private repository: UserRepository) {}

  @Get('/permissions')
  public async getPermissions(
    @CurrentUser({ required: true }) user: User
  ): Promise<{ username: string; admin: boolean }> {
    const isAdmin = await this.repository.isAdmin(user.username);

    return {
      username: user.username,
      admin: isAdmin
    };
  }

  @Post('/auth')
  public async post(
    @Body({ required: true })
    payload: {
      username?: string;
      password?: string;
      challenge?: string;
      challengeResponse?: string;
    }
  ): Promise<{
    authenticatorUrl?: string;
    challenge?: string;
    token?: string;
  }> {
    if (payload.username && payload.password) {
      const { username, password } = payload;

      const user = await this.repository.getUser(username);

      if (!user) {
        throw Boom.unauthorized('No such user');
      }

      const challenge = await this.getAuthChallenge(
        user,
        Buffer.from(password, 'base64').toString('utf8')
      );
      const sendAuthenticatorUrl = !user.authenticatorSecret;

      if (!user.authenticatorSecret) {
        let secret = '';
        const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        for (const value of crypto.randomBytes(16).values()) {
          secret += validChars[Math.floor((value / 256) * validChars.length)];
        }
        user.authenticatorSecret = secret;
        await this.repository.storeAuthenticatorSecret(
          user.username,
          user.authenticatorSecret
        );
      }

      return {
        challenge,
        authenticatorUrl: sendAuthenticatorUrl
          ? `otpauth://totp/Xapphire13?secret=${user.authenticatorSecret}`
          : undefined
      };
    }
    if (payload.challenge && payload.challengeResponse) {
      const { challenge, challengeResponse } = payload;

      const decodedToken = (() => {
        const decodedToken = jwt.decode(challenge);

        if (!decodedToken) {
          throw Boom.unauthorized('Invalid token');
        }

        return decodedToken as { username: string; type: string };
      })();

      const user = await this.repository.getUser(decodedToken.username);

      if (!user) {
        throw Boom.unauthorized('No such user');
      }

      const authToken = await this.getAuthToken(
        user,
        challengeResponse,
        challenge
      );

      return {
        token: authToken
      };
    }

    throw Boom.badRequest();
  }

  private async getAuthToken(
    user: User,
    authCode: string,
    tempToken: string
  ): Promise<string> {
    const token = new Promise<string | object>((res, rej) =>
      jwt.verify(tempToken, user.tokenSecret, (err, valid) =>
        err ? rej(err) : res(valid)
      )
    );
    const authCodeValid = otplib.authenticator.check(
      authCode,
      user.authenticatorSecret
    );
    const tokenValid = await token.then(
      () => true,
      () => false
    );

    if (!authCodeValid || !tokenValid) {
      throw Boom.unauthorized('Invalid code/token');
    }

    return new Promise<string>((res, rej) =>
      jwt.sign(
        {
          type: 'auth',
          username: user.username
        },
        user.tokenSecret,
        {
          expiresIn: '30d'
        },
        (err, token) => (err ? rej(err) : res(token))
      )
    );
  }

  private async getAuthChallenge(
    user: User,
    password: string
  ): Promise<string> {
    if (!user.passwordHash) {
      // No password set, set it
      user.passwordHash = await bcrypt.hash(password, 10);
      await this.repository.storePasswordHash(user.username, user.passwordHash);
    } else if (!(await bcrypt.compare(password, user.passwordHash))) {
      // Password set, check it
      throw Boom.unauthorized('Incorrect username/password');
    }

    // Password is good, generate temporary token

    if (!user.tokenSecret) {
      user.tokenSecret = crypto.randomBytes(32).toString('hex');
      await this.repository.storeTokenSecret(user.username, user.tokenSecret);
    }

    return new Promise<string>((res, rej) =>
      jwt.sign(
        {
          type: 'temporary',
          username: user.username
        },
        user.tokenSecret,
        {
          expiresIn: '10m'
        },
        (err, token) => (err ? rej(err) : res(token))
      )
    );
  }
}
