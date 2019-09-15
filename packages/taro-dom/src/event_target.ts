import { isArray, isObject } from './utils/is'

interface EventListenerOptions {
  capture?: boolean;
}

interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
}

export class TaroEventTarget {
  protected __handlers: Record<string, Function[]> = {}

  public addEventListener (type: string, handler: Function, options?: boolean | AddEventListenerOptions) {
    const handlers = this.__handlers[type]
    let isCapture = Boolean(options)
    let isOnce = false
    if (isObject<AddEventListenerOptions>(options)) {
      isCapture = Boolean(options.capture)
      isOnce = Boolean(options.once)
    }

    if (isOnce) {
      const wrapper = function () {
        handler.apply(this, arguments) // this 指向 Element
        this.removeEventListener(type, wrapper)
      }
      this.addEventListener(type, wrapper, {
        ...(options as AddEventListenerOptions),
        once: false
      })
      return
    }

    if (isCapture) {
      // TODO: 实现 Capture
      // eslint-disable-next-line no-console
      console.error('The event capture feature is unimplemented.')
    }

    if (isArray(handlers)) {
      handlers.push(handler)
    } else {
      this.__handlers[type] = [handler]
    }
  }

  public removeEventListener (type: string, handler: Function) {
    if (handler == null) {
      return
    }

    const handlers = this.__handlers[type]
    if (!isArray(handlers)) {
      return
    }

    const index = this.findIndex(handlers, handler)
    handlers.splice(index, 1)
  }

  protected findIndex<T> (childeNodes: T[], refChild: T | null) {
    const index = childeNodes.indexOf(refChild)
    if (index === -1) {
      throw new Error('refChild 不属于') // 改进报错
    }

    return index
  }
}
