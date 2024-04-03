import MyPromise from '../lib/index.js'

const p = new Promise((resolve, reject) => {
  // pending
  console.log('11111111')

  // fulfilled
  resolve('resolve value')

  // rejected
  reject('reject value')
})

p.then((value) => {
  console.log(value)
  console.log('执行了then1')
})
  .then((value) => {
    console.log(value)
    console.log('执行了then2')
  })
  .catch((err) => {
    console.log(err)
    console.log('执行了catch1')
  })
  .catch((err) => {
    console.log(err)
    console.log('执行了catch2')
  })
  .finally()

// Promise.allSettled()
