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

  success({
    payload,
    statusCode = 200,
  }: {
    payload?: ResponsePayload<T>;
    statusCode?: number;
  }) {
    this.payload = payload;
    this.statusCode = statusCode;

    return this;
  }
}
