export default interface Log {
  timestamp: string;
  level: number;
  message: string;
  exception?: string;
}