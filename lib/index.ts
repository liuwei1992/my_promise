import type { FulfilledResult, RejectedResult } from './types'
import { Status } from './types'

class MyPromise {
  onfulfills: ((value: any) => void)[] = []
  onrejects: ((reason?: any) => void)[] = []
  onfinallys: (() => void)[] = []
  status: Status = Status.PENDING
  value: any = undefined
  reason: any = undefined

  resolve = (value: any) => {
    this.value = value
    if (this.status === Status.PENDING) {
      queueMicrotask(() => {
        if (this.status !== Status.PENDING) return
        this.status = Status.FULFILLED
        this.onfulfills.forEach((onfulfilled) => {
          onfulfilled(value)
        })
      })
    }
  }

  reject = (reason?: any) => {
    this.reason = reason
    if (this.status === Status.PENDING) {
      queueMicrotask(() => {
        if (this.status !== Status.PENDING) return

        this.status = Status.REJECTED
        // console.log('this.onrejects22222', this.onrejects)

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
    // 立即执行
    executor(this.resolve, this.reject)
  }

  then(
    onfulfilled: (value: any) => any = (value) => value,
    onrejected: (reason?: any) => void = (err) => {
      throw err
    }, // 这个是then链式调用，最终公用catch的关键 1 默认throw
  ): MyPromise {
    // 链式调用
    return new MyPromise((resolve, reject) => {
      if (Status.PENDING === this.status) {
        if (onfulfilled) {
          // this.onfulfills.push(onfulfilled)
          this.onfulfills.push(() => {
            const result = onfulfilled(this.value)
            resolve(result)
          })
        }

        if (onrejected) {
          this.onrejects.push(() => {
            // 这个是then链式调用，最终公用catch的关键 2
            try {
              const reason = onrejected(this.reason)
              resolve(reason)
            } catch (err) {
              reject(err)
            }
          })

          // console.log('this.onrejects11111', this.onrejects)
        }
      } else if (Status.FULFILLED === this.status) {
        // 已经执行完的 promise 在添加then方法时会立即执行
        const result = onfulfilled(this.value)
        resolve(result)
      } else if (onrejected && Status.REJECTED === this.status) {
        onrejected(this.reason)
        resolve(this.reason)
      }
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
    const values: (FulfilledResult | RejectedResult)[] = []
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

  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved or rejected.
   */
  static race(promises: MyPromise[]): MyPromise {
    return new MyPromise((resolve, reject) => {
      promises.forEach((p) => {
        p.then(resolve, reject)
      })
    })
  }

  // 返回第一个resolved结果
  static any(promises: MyPromise[]): MyPromise {
    const reasons = []
    return new MyPromise((resolve, reject) => {
      promises.forEach((p) => {
        p.then(resolve, (reason) => {
          reasons.push(reason)
          if (reasons.length === promises.length) {
            reject('All promises were rejected')
          }
        })
      })
    })
  }
}

export default MyPromise
