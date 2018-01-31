import {LogRepository} from "../repositories/log-repository";
import {Log} from "../models/log";
import {JsonController, Get, Authorized, QueryParam} from "routing-controllers";
import {createPage, getPagingAdvice, ContinuationToken, Page} from "../pagination";
import {Inject} from "typedi";

export const DEFAULT_PAGE_SIZE = 20;

@JsonController("/api")
export class LogController {
  private createPage = createPage<Log>("timestamp", log => `${log.timestamp}_${log.level}_${log.message}_${log.exception}`);

  constructor(@Inject("LogRepository") private repository: LogRepository) {}

  @Get("/logs")
  @Authorized()
  public async getLogs(@QueryParam("continue") continuationToken?: string): Promise<Page<Log>> {
    const token = continuationToken && new ContinuationToken(continuationToken);
    const pagingAdvice = token && getPagingAdvice(DEFAULT_PAGE_SIZE, token);
    const pageSize = pagingAdvice ? pagingAdvice.limit : DEFAULT_PAGE_SIZE;
    let logs = await this.repository.getLogs(pageSize, pagingAdvice && pagingAdvice.from);
    if (token) {
      logs = logs.slice(token.offset);
    }

    return this.createPage(pageSize, logs);
  }
}
