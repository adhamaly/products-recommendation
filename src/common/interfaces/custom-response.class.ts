export interface ResponsePayload<T> {
  data?: T[] | T;
  pages?: number;
  page?: number;
  limit?: number;
  total?: number;
}

export class CustomResponse<T = any> {
  payload?: ResponsePayload<T>;
  statusCode: number;
  message?: string;

  success({
    payload,
    statusCode = 200,
    message,
  }: {
    payload?: ResponsePayload<T>;
    statusCode?: number;
    message?: string;
  }) {
    this.payload = payload;
    this.statusCode = statusCode;
    this.message = message;
    return this;
  }
}
