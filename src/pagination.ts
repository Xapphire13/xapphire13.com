import * as crc32 from "crc-32";

export interface PagingAdvice {
  limit: number;
  from: string;
}

export interface Page<T = any> {
  values: T[];
  continuationToken: string | null;
}

export class ContinuationToken {
  public id: string;
  public offset: number;
  public hash: number;

  constructor(id: string, offset: number, hash: number)
  constructor(token64: string) {
    let id: string = arguments[0];
    let offset: number = arguments[1];
    let hash: number = arguments[2];

    if (arguments.length === 1) {
      let offsetStr, hashStr: string;
      [id = "", offsetStr = "0", hashStr = "0"] = new Buffer(token64, "base64").toString().split("_");
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

  let from = "$id";

  if (!isNaN(Date.parse(id))) {
    from = "datetime($id)"
  }

  return {
    from,
    limit: pageSize + offset
  }
}

export function createPage<T extends any>(pageSize: number, idKey: string, createHashString: (item: T) => string, values: T[], previousToken?: ContinuationToken): Page {
  if (!values.length) {
    return {
      values,
      continuationToken: null
    }
  }

  if (!previousToken) {
    return {
      values: values,
      continuationToken: values.length < pageSize ? null : createToken(idKey, values, createHashString).toBase64()
    }
  }

  const idsDiffer = `${values[0][idKey]}` !== previousToken.id;
  const hashesDiffer = hash(values.slice(0, previousToken.offset).map(createHashString)) !== previousToken.hash;

  if (idsDiffer || hashesDiffer) {
    return {
      values,
      continuationToken: values.length < pageSize ? null : createToken(idKey, values, createHashString).toBase64()
    }
  }

  return {
    values: values.slice(previousToken.offset),
    continuationToken: values.length < pageSize ? null : createToken(idKey, values.slice(previousToken.offset), createHashString).toBase64()
  };
}

function createToken<T extends any>(idKey: string, values: T[], createHashString: (item: T) => string): ContinuationToken {
  const firstItem: T = values[0];

  return new ContinuationToken(firstItem[idKey], values.length, hash(values.map(createHashString)));
}

export function hash(inputs: string[]): number {
  return crc32.str(inputs.join("_"));
}
