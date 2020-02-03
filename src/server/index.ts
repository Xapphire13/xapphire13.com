import 'reflect-metadata';
import './error-handler';
import jwt from 'jsonwebtoken';
import path from 'path';
import { useContainer, useExpressServer } from 'routing-controllers';
import { container } from 'tsyringe';
import { MongoClient } from 'mongodb';
import { ApolloServer, IResolvers } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { APP_PATH } from './constants';
import { Logger } from './logger';
import { UserRepository } from './repositories/UserRepository';
import registerDependencies from './registerDependencies';
import config from './config';

import bodyParser = require('body-parser');
import express = require('express');

async function main(): Promise<void> {
  const mongoDb = new MongoClient(config.mongoDbConnectionString(), {
    useUnifiedTopology: true
  });
  await mongoDb.connect();

  container.registerInstance('Config', config);
  registerDependencies(mongoDb);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useContainer({
    get: (token: any) => container.resolve(token)
  });

  // GraphQL
  const apolloServer = new ApolloServer({
    typeDefs: await importSchema(path.join(__dirname, './schema.graphql')),
    resolvers: container.resolveAll<IResolvers>('Resolver')
  });
  const app = express();
  apolloServer.applyMiddleware({ app });
  app.set('port', process.env.PORT || 8080);
  app.use(bodyParser.json());

  // Controllers
  const getToken = (authHeader: string = ''): string | null => {
    const matches = /Bearer (.*)/i.exec(authHeader);

    return matches && matches[1];
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useExpressServer(app, {
    controllers: [path.join(__dirname, 'controllers/*.js')],
    defaultErrorHandler: false,
    authorizationChecker: async (action, _roles) => {
      const token = getToken(action.request.get('Authorization'));

      if (!token) {
        return false;
      }

      const { username } = (() => {
        const decodedToken = jwt.decode(token) as any;

        if (!decodedToken || decodedToken.type !== 'auth') {
          throw new Error('Invalid token');
        }

        return decodedToken;
      })();

      const user = await container
        .resolve<UserRepository>('UserRepository')
        .getUser(username);

      if (!user) {
        return false;
      }

      return new Promise<boolean>(res =>
        jwt.verify(token, user.tokenSecret, (err: any) => res(!err))
      );
    },
    currentUserChecker: async action => {
      const token = getToken(action.request.get('Authorization'));

      if (!token) {
        return null;
      }

      const { username } = jwt.decode(token) as any;

      return container
        .resolve<UserRepository>('UserRepository')
        .getUser(username);
    }
  });

  // non-controller routes
  app.use('/app', express.static(APP_PATH));
  app.use((_req, res) => {
    if (!res.headersSent) {
      res.sendFile(path.join(APP_PATH, 'index.html'));
    }
  });

  // Start!
  app.listen(app.get('port'), () => {
    container
      .resolve<Logger>('Logger')
      .debug(`Listening on port ${app.get('port')}`);
  });
}

main();
