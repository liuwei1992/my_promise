class MyPromise {
  onfulfills: (() => void)[] = []
  onrejects: (() => void)[] = []

  constructor(
    executor: (
      resolve: (value: unknown) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    console.log('创建成功！')

    const resolve = () => {
      this.onfulfills.forEach((onfulfilled) => {
        onfulfilled()
      })
    }

    const reject = () => {}

    // 立即执行
    executor(resolve, reject)
  }

  then(onfulfilled?: (value?: any) => void) {
    if (!onfulfilled) return

    this.onfulfills.push(onfulfilled)
  }

  catch(onrejected?: (reason?: any) => void) {
    if (!onrejected) return

    this.onrejects.push(onrejected)
  }
}

export default MyPromise
