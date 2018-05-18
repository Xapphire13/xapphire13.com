import * as crc32 from "crc-32";
import {Page} from "xapphire13-entities";

export interface PagingAdvice {
  limit: number;
  from: string;
}

export class ContinuationToken {
  public id: string;
  public offset: number;
  public hash: number;

  constructor(token64: string)
  constructor(id: string, offset: number, hash: number)
  constructor(idOrToken64: string, offset?: number, hash?: number) {
    let id = idOrToken64;

    if (offset == undefined || hash == undefined) {
      let offsetStr, hashStr: string;
      [id = "", offsetStr = "0", hashStr = "0"] = new Buffer(idOrToken64, "base64").toString().split("_");
      offset = ~~offsetStr;
      hash = ~~hashStr;
    }

    this.id = id;
    this.offset = offset;
    this.hash = hash;
  }

  public toBase64(): string {
    return new Buffer(`${this.id}_${this.offset}_${this.hash}`).toString("base64");
  }
}

export function getPagingAdvice(pageSize: number, continuationToken: ContinuationToken): PagingAdvice {
  const {id = "", offset = 0} = continuationToken ? continuationToken : {};

  return {
    from: id,
    limit: pageSize + offset
  };
}

export function createPage<T extends any>(idKey: string, createHashString: (item: T) => string): (pageSize: number, values: T[], previousToken?: ContinuationToken) => Page<T> {
  const getContinuationToken = (pageSize: number, values: T[], offset: number = 0) => (values.length + offset) < pageSize ? null : createToken(idKey, createHashString)(values).toBase64();

  return (pageSize: number, values: T[], previousToken?: ContinuationToken): Page<T> => {
    if (!values.length || !previousToken) {
      return {
        values: values,
        continuationToken: getContinuationToken(pageSize, values)
      };
    }

    const idsDiffer = `${values[0][idKey]}` !== previousToken.id;
    const hashesDiffer = hash(values.slice(0, previousToken.offset).map(createHashString)) !== previousToken.hash;

    if (!idsDiffer && !hashesDiffer) {
      values = values.slice(previousToken.offset);
    }

    return {
      values,
      continuationToken: getContinuationToken(pageSize, values, previousToken.offset)
    };
  };
}

const createToken = <T extends any>(idKey: string, createHashString: (item: T) => string) => (values: T[]): ContinuationToken => {
  const firstItem: T = values[0];

  return new ContinuationToken(firstItem[idKey], values.length, hash(values.map(createHashString)));
};

export function hash(inputs: string[]): number {
  return crc32.str(inputs.join("_"));
}
