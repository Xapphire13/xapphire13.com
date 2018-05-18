import {Disposable} from "./disposable";

export function subscribeToEvent<K extends keyof WindowEventMap>(target: EventTarget, event: K, listener: (this: Window, ev: WindowEventMap[K]) => any): Disposable {
  target.addEventListener(event, listener);

  let dispose = () => {
    target.removeEventListener(event, listener);
    dispose = () => {};
  };

  return {
    dispose
  };
}
