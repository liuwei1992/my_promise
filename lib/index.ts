import type { PromiseFulfilledResult, PromiseRejectedResult } from './types'
import { Status } from './types'

class MyPromise {
  onfulfills: ((value: any) => void)[] = []
  onrejects: ((reason?: any) => void)[] = []
  onfinallys: (() => void)[] = []
  status: Status = Status.PENDING
  resolveValue: any = undefined

  resolve = (value: any) => {
    this.resolveValue = value
    // if (value instanceof MyPromise) {
    //   // promise的值？？？？ 2）thenable对象
    // } else
    if (this.status === Status.PENDING) {
      this.status = Status.FULFILLED
      queueMicrotask(() => {
        this.onfulfills.forEach((onfulfilled) => {
          onfulfilled(value)
        })
      })
    }
  }

  reject = (reason?: any) => {
    if (this.status === Status.PENDING) {
      this.status = Status.REJECTED
      queueMicrotask(() => {
        this.onrejects.forEach((onrejected) => {
          onrejected(reason)
        })
      })
    }
  }

  constructor(
    executor: (
      resolve: (value: unknown) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    console.log('创建成功！')

    // 立即执行
    executor(this.resolve, this.reject)
  }

  then(
    onfulfilled: (value: any) => void = (value) => {
      return value
    },
    onrejected?: (reason?: any) => void,
  ): MyPromise {
    // 链式调用
    return new MyPromise((resolve, reject) => {
      this.onfulfills.push(() => {
        const result = onfulfilled(this.resolveValue)
        resolve(result)
      })

      onrejected &&
        this.onrejects.push(() => {
          const result = onrejected(this.resolveValue)
          reject(result)
        })
    })
  }

  catch(onrejected?: (reason?: any) => void): MyPromise {
    return this.then(undefined, onrejected)
  }

  finally(onfinally?: () => void): MyPromise {
    return this.then(onfinally, onfinally)
  }

  static resolve(value: any) {
    return new MyPromise((resolve) => resolve(value))
  }

  static reject(reason?: any) {
    return new MyPromise((_, reject) => reject(reason))
  }

  static all(promises: MyPromise[]) {
    const values: any[] = []
    return new MyPromise((resolve, reject) => {
      promises.forEach((p) => {
        p.then(
          (value) => {
            values.push(value)
            if (values.length === promises.length) {
              resolve(values)
            }
          },
          (err) => {
            reject(err)
          },
        )
      })
    })
  }

  static allSettled(promises: MyPromise[]): MyPromise {
    const values: (PromiseFulfilledResult | PromiseRejectedResult)[] = []
    return new MyPromise((resolve, reject) => {
      promises.forEach((p) => {
        p.then(
          (value) => {
            values.push({ status: Status.FULFILLED, value })
          },
          (reason) => {
            values.push({ status: Status.REJECTED, reason })
          },
        ).finally(() => {
          if (values.length === promises.length) {
            resolve(values)
          }
        })
      })
    })
  }
}

export default MyPromise
