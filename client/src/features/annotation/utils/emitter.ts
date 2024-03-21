import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

const Emitter = {
  on: <T extends unknown[]>(event: string, listener: (...args: T) => void) => {
    eventEmitter.on(event, listener);
  },
  off: <T extends unknown[]>(event: string, listener: (...args: T) => void) => {
    eventEmitter.off(event, listener);
  },
  emit: <T extends unknown[]>(event: string, ...args: T) => {
    eventEmitter.emit(event, ...args);
  },
  removeAllListeners: (event: string) => {
    eventEmitter.removeAllListeners(event);
  },
  once: <T extends unknown[]>(event: string, listener: (...args: T) => void) => {
    eventEmitter.once(event, listener);
  }
};

Object.freeze(Emitter);

export default Emitter;