import MyPromise from './my-promise.ts'

const p = new MyPromise((resolve, reject) => {
  // fulfilled
  resolve('hello resolve')

  // rejected
  // reject('reject value---------')
})

p.then(
  (value) => {
    console.log(value)
    console.log('执行了then1')
  },
  (err) => {
    console.log('执行了then catch', err)
    throw 'hhhhhhh'
  },
)
  .then((res) => {
    console.log('then2 res', res)
  })
  .catch((err) => {
    console.log(err)
    console.error('执行了catch1')
  })

// p.then(
//   (res) => {
//     console.log('res1', res)
//     return 'res11111'
//   },
//   (err) => {
//     console.log('err', err)
//     return 'err11111'
//   },
// ).then(
//   (res) => {
//     console.log('res2', res)
//   },
//   (err) => {
//     console.log('err2', err)
//   },
// )

// Promise.any()
