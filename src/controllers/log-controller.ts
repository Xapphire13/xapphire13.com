import {LogRepository} from "../repositories/log-repository";
import {Log} from "../models/log";
import {JsonController, Get, Authorized, QueryParam} from "routing-controllers";
import {PagedResponse} from "../paged-response";
import {Inject} from "typedi";

const DEFAULT_PAGE_SIZE = 20;

@JsonController("/api")
export class LogController {
  constructor(@Inject("LogRepository") private repository: LogRepository) {}

  @Get("/logs")
  @Authorized()
  public async getLogs(@QueryParam("fromTimestamp") fromTimestamp?: string): Promise<PagedResponse<Log>> {
    const logs = await this.repository.getLogs(DEFAULT_PAGE_SIZE, fromTimestamp);
    const continuationToken = logs.length ? logs[logs.length - 1].timestamp : null;

    return {
      values: logs,
      continuationToken
    }
  }
}
