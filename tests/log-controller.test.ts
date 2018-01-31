import * as moment from "moment";
import {LogRepository} from "../src/repositories/log-repository";
import {LogController, DEFAULT_PAGE_SIZE} from "../src/controllers/log-controller";
import {Log} from "../src/models/log";

test("Returns logs from the repository", async () => {
  const mockLogRepository = new MockLogRepository();
  const controller = new LogController(mockLogRepository);
  const logs: Log[] = createLogs(1, 1);
  mockLogRepository.getLogs.mockReturnValue(logs);

  const result = await controller.getLogs();

  expect(result.values).toEqual(logs);
});

test("Returns null continuation token when all logs returned", async () => {
  const mockLogRepository = new MockLogRepository();
  const controller = new LogController(mockLogRepository);
  const logs: Log[] = createLogs(1, 1);
  mockLogRepository.getLogs.mockReturnValue(logs);

  const result = await controller.getLogs();

  expect(result.continuationToken).toBeNull();
});

test("Returns first page when no token given", async () => {
  const mockLogRepository = new MockLogRepository();
  const controller = new LogController(mockLogRepository);
  const logs: Log[] = createLogs(2 * DEFAULT_PAGE_SIZE, 1);
  mockLogRepository.getLogs.mockImplementation((limit: number) => {
    return logs.slice(0, limit);
  });

  const result = await controller.getLogs();

  expect(result.values.length).toBe(DEFAULT_PAGE_SIZE);
  expect(result.values).toEqual(logs.slice(0, DEFAULT_PAGE_SIZE));
});

test("Returns second page when token is given (all the same time)", async () => {
  const mockLogRepository = new MockLogRepository();
  const controller = new LogController(mockLogRepository);
  const logs: Log[] = createLogs(2 * DEFAULT_PAGE_SIZE, 1);
  mockLogRepository.getLogs.mockImplementation((limit: number, fromTimestamp?: string) => {
    return logs.filter(log => fromTimestamp ? Date.parse(log.timestamp) <= Date.parse(fromTimestamp) : true)
      .slice(0, limit);
  });

  let result = await controller.getLogs();
  result = await controller.getLogs(result.continuationToken!);

  expect(result.values.length).toBe(DEFAULT_PAGE_SIZE);
  expect(result.values).toEqual(logs.slice(DEFAULT_PAGE_SIZE, 2 * DEFAULT_PAGE_SIZE));
});

test("Returns second page when token is given (all different times)", async () => {
  const mockLogRepository = new MockLogRepository();
  const controller = new LogController(mockLogRepository);
  const logs: Log[] = createLogs(2 * DEFAULT_PAGE_SIZE, 1, true);
  mockLogRepository.getLogs.mockImplementation((limit: number, fromTimestamp?: string) => {
    return logs.filter(log => fromTimestamp ? Date.parse(log.timestamp) <= Date.parse(fromTimestamp) : true)
      .slice(0, limit);
  });

  let result = await controller.getLogs();
  result = await controller.getLogs(result.continuationToken!);

  expect(result.values.length).toBe(DEFAULT_PAGE_SIZE);
  expect(result.values).toEqual(logs.slice(DEFAULT_PAGE_SIZE, 2 * DEFAULT_PAGE_SIZE));
});

test("Returns empty page when all items have been served (count === pageSize)", async () => {
  const mockLogRepository = new MockLogRepository();
  const controller = new LogController(mockLogRepository);
  const logs: Log[] = createLogs(DEFAULT_PAGE_SIZE, 1, true);
  mockLogRepository.getLogs.mockImplementation((limit: number, fromTimestamp?: string) => {
    return logs.filter(log => fromTimestamp ? Date.parse(log.timestamp) <= Date.parse(fromTimestamp) : true)
      .slice(0, limit);
  });

  let result = await controller.getLogs();
  result = await controller.getLogs(result.continuationToken!);

  expect(result.values.length).toBe(0);
  expect(result.continuationToken).toBeNull();
});

test("Returns empty page when all items have been served (count < pageSize)", async () => {
  const mockLogRepository = new MockLogRepository();
  const controller = new LogController(mockLogRepository);
  const count = Math.floor(DEFAULT_PAGE_SIZE / 2);
  const logs: Log[] = createLogs(count, 1, true);
  mockLogRepository.getLogs.mockImplementation((limit: number, fromTimestamp?: string) => {
    return logs.filter(log => fromTimestamp ? Date.parse(log.timestamp) <= Date.parse(fromTimestamp) : true)
      .slice(0, limit);
  });

  const result = await controller.getLogs();

  expect(result.values.length).toBe(count);
  expect(result.continuationToken).toBeNull();
});

function createLogs(count: number, level: number, staggerTime: boolean = false): Log[] {
  const logs: Log[] = [];
  const now = moment();
  let delta = 0;

  for(let i = 0; i < count; i++) {
    if (staggerTime) delta++;

    logs.push({
      timestamp: now.subtract(delta, "ms").toJSON(),
      level,
      message: "Test message"
    });
  }

  return logs;
}

class MockLogRepository implements LogRepository {
  public createLog = jest.fn();
  public getLogs = jest.fn();
}
