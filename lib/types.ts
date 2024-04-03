export interface PromiseFulfilledResult {
  status: Status.FULFILLED
  value: any
}

export interface PromiseRejectedResult {
  status: Status.REJECTED
  reason: any
}

export enum Status {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
