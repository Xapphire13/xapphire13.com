import { IResolvers } from 'apollo-server-express';

export default interface Resolver {
  readonly Query?: IResolvers;

  readonly Mutation?: IResolvers;
}
