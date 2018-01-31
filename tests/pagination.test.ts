import {createPage, hash, getPagingAdvice, ContinuationToken} from "../src/pagination";

describe("getPagingAdvice()", () => {
  test("returns a limit equal to offset + pagesize", async () => {
    const offset = 5;
    const pageSize = 10;
    const token = new ContinuationToken("foo", offset, 0);

    const result = getPagingAdvice(pageSize, token);

    expect(result.limit).toBe(offset + pageSize);
  });

  test(".from is $id when id is not a date", () => {
    const token = new ContinuationToken("foo", 0, 0);

    const result = getPagingAdvice(5, token);

    expect(result.from).toBe("$id");
  });

  test(".from is datetime($id) when id is a date", () => {
    const token = new ContinuationToken(new Date().toJSON(), 0, 0);

    const result = getPagingAdvice(5, token);

    expect(result.from).toBe("datetime($id)");
  });
});

describe("createPage()", () => {
  test("returns empty page when no values", () => {
    const result = createPage(10, "id", () => "", []);

    expect(result.continuationToken).toBeNull();
    expect(result.values).toEqual([]);
  });

  test("returns all given values when it's the first page", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage(10, "id", item => `${item.id}`, values);

    expect(result.values).toEqual(values);
  });

  test("returns null continuationToken when first page contains all items", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage(10, "id", item => `${item.id}`, values);

    expect(result.continuationToken).toBeNull();
  });

  test("returns continuationToken when first page isn't all items", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage(1, "id", item => `${item.id}`, values);

    expect(result.continuationToken).not.toBeNull();
  });

  test("returns continuationToken when first page is exactly pageSize", () => {
    const values = [{id: 2}, {id: 1}];
    const result = createPage(values.length, "id", item => `${item.id}`, values);

    expect(result.continuationToken).not.toBeNull();
  });

  test("skips the items from the previous page", () => {
    const values = [{id: 3}, {id: 2}, {id: 1}];
    const token = new ContinuationToken("3", 1, hash(["3"]))
    const result = createPage(10, "id", item => `${item.id}`, values, token);

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
    const result = createPage(10, "group", getHashString, values, token);

    expect(result.values).toEqual(values.slice(2));
  });

  test("returns all items when the previous token's id has been removed", () => {
    const values = [{id: 2}, {id: 1}];
    const token = new ContinuationToken("3", 1, hash(["3"]))
    const result = createPage(10, "id", item => `${item.id}`, values, token);

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
    const result = createPage(10, "group", getHashString, values, token);

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
    const result = createPage(10, "group", getHashString, values, token);

    expect(result.values).toEqual(values);
  });
});