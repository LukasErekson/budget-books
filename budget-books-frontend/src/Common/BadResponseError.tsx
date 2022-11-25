class BadResponseError extends Error {
  status: number;
  serverError: string;

  constructor(status: number, message: string, serverError: string) {
    super(message);

    this.status = status;
    this.serverError = serverError;

    Object.setPrototypeOf(this, BadResponseError.prototype);
  }
}

export default BadResponseError;
