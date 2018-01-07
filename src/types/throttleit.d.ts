declare module "throttleit" {
  function throttle<T extends Function>(func: T, wait: number): T;

  export = throttle;
}
