import {Disposable} from "./disposable";
import {toast} from "react-toastify";

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

export function onError(message: string, toastId: number): number;
export function onError(message: string, err: Error, toastId: number): number;
export function onError(message: string, errOrToastId: Error | number, toastId?: number): number {
  if (errOrToastId instanceof Error) {
    console.error(errOrToastId);
  } else {
    toastId = errOrToastId;
  }

  if (toastId && toast.isActive(toastId)) {
    toast.update(toastId);
  } else {
    return toast.error(message);
  }

  return toastId;
}
