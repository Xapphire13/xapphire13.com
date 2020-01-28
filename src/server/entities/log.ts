export default interface Log {
  timestamp: Date;
  level: number;
  message: string;
  exception?: string;
}
