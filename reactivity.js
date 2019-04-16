class DependencyObserver {
  constructor() {
    this.subscribers = []
  }

  depends(callback) {
    if (callback && !this.subscribers.includes(callback)) {
      this.subscribers.push(callback)
    }
  }

  notify() {
    this.subscribers.forEach(subscriber => subscriber())
  }
}

class Reactivity {
  constructor(object) {
    const instance = this

    if (object.data) {
      Object.keys(object.data).forEach((key) => {
        let internalValue = object.data[key]
        const dependencyObserver = new DependencyObserver();

        Object.defineProperty(object.data, key, {
          get() {
            dependencyObserver.depends(instance.targetFunction)
            return internalValue
          },
          set(value) {
            internalValue = value
            dependencyObserver.notify()
          }
        })
      })
    }

    if (object.computed) {
      this.watch(object.data, object.computed);
    }
  }

  watch(data, computedData) {
    Object.keys(computedData).forEach((key) => {
      const func = computedData[key]
      this.targetFunction = func.bind(data)
      this.targetFunction()
      this.targetFunction = null
    })
  }
}
