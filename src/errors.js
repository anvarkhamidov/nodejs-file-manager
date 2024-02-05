export class InvalidInputError extends Error {
  constructor(msg) {
    super(msg ?? "Invalid input");
  }
}

export class OperationFailedError extends Error {
  constructor(msg) {
    super(msg ?? "Operation failed");
  }
}