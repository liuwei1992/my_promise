export enum Status {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
export interface FulfilledResult {
  status: Status.FULFILLED
  value: any
}

export interface RejectedResult {
  status: Status.REJECTED
  reason: any
}
