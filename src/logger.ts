export interface Logger {
  debug(message: string): Promise<void>
  log(message: string): Promise<void>;
  error(message: string): Promise<void>;
  error(exception: Error): Promise<void>;
}
