export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Bad request" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface IResponseError {
  status: string;
  message: string;
  statusCode: number;
}
