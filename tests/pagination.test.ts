import {createPage, hash, getPagingAdvice, ContinuationToken} from "../src/pagination";

describe("ContinuationToken", () => {
  test("can be constructed from an id, offset and a hash", () => {
    const token = new ContinuationToken("foo", 1, 2);

    expect(token.id).toBe("foo");
    expect(token.offset).toBe(1);
    expect(token.hash).toBe(2);
  });

  test("can be constructed from a base64 token", () => {
    const token = new ContinuationToken(new Buffer("foo_1_2").toString("base64"));

    expect(token.id).toBe("foo");
    expect(token.offset).toBe(1);
    expect(token.hash).toBe(2);
  });
});

describe("getPagingAdvice()", () => {
  test("returns a limit equal to offset + pagesize", async () => {
    const offset = 5;
    const pageSize = 10;
    const token = new ContinuationToken("foo", offset, 0);

    const result = getPagingAdvice(pageSize, token);

    expect(result.limit).toBe(offset + pageSize);
  });

  test(".from is to id from the continuation token", () => {
    const token = new ContinuationToken("foo", 0, 0);

    const result = getPagingAdvice(5, token);

    expect(result.from).toBe("foo");
  });
});

describe("createPage()", () => {
  test("returns empty page when no values", () => {
    const result = createPage("id", () => "")(10, []);

    expect(result.continuationToken).toBeNull();
    expect(result.values).toEqual([]);
  });

  test("returns all given values when it's the first page", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage<any>("id", item => `${item.id}`)(10, values);

    expect(result.values).toEqual(values);
  });

  test("returns null continuationToken when first page contains all items", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage<any>("id", item => `${item.id}`)(10, values);

    expect(result.continuationToken).toBeNull();
  });

  test("returns continuationToken when first page isn't all items", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage<any>("id", item => `${item.id}`)(1, values);

    expect(result.continuationToken).not.toBeNull();
  });

  test("returns continuationToken when first page is exactly pageSize", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage<any>("id", item => `${item.id}`)(values.length, values);

    expect(result.continuationToken).not.toBeNull();
  });

  test("skips the items from the previous page", () => {
    const values = [{id: 3}, {id: 2}, {id: 1}];
    const token = new ContinuationToken("3", 1, hash(["3"]))
    const result = createPage<any>("id", item => `${item.id}`)(10, values, token);

    expect(result.values).toEqual(values.slice(1));
  });

  test("skips the items from the previous page when id's aren't unique", () => {
    let values = [{
      group: 2,
      value: "foo"
    }, {
      group: 2,
      value: "bar"
    }, {
      group: 1,
      value: "foo"
    }];
    const getHashString = (item: any) => `${item.group}_${item.value}`;
    const token = new ContinuationToken("2", 2, hash([getHashString(values[0]), getHashString(values[1])]))
    const result = createPage("group", getHashString)(10, values, token);

    expect(result.values).toEqual(values.slice(2));
  });

  test("returns all items when the previous token's id has been removed", () => {
    const values = [{id: 2}, {id: 1}];
    const token = new ContinuationToken("3", 1, hash(["3"]))
    const result = createPage<any>("id", item => `${item.id}`)(10, values, token);

    expect(result.values).toEqual(values);
  });

  test("returns all items when an item has been inserted into the previous page", () => {
    const values = [{
      group: 2,
      value: "foo"
    }, {
      group: 2,
      value: "bar"
    }, {
      group: 1,
      value: "foo"
    }];
    const getHashString = (item: any) => `${item.group}_${item.value}`;
    const token = new ContinuationToken("2", 1, hash([getHashString(values[1])]))
    const result = createPage("group", getHashString)(10, values, token);

    expect(result.values).toEqual(values);
  });

  test("returns all items when an item has been deleted from the previous page", () => {
    let values = [{
      group: 2,
      value: "foo"
    }, {
      group: 2,
      value: "bar"
    }, {
      group: 1,
      value: "foo"
    }];
    const getHashString = (item: any) => `${item.group}_${item.value}`;
    const token = new ContinuationToken("2", 2, hash([getHashString(values[0]), getHashString(values[1])]))
    values = values.slice(1);
    const result = createPage("group", getHashString)(10, values, token);

    expect(result.values).toEqual(values);
  });
});
