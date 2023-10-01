export interface ResponseData<T> {
  status: true | false;
  status_code: number;
  message: string;
  data?: T;
}

export function generateResponse<T>(
  status: true | false,
  status_code: number,
  message: string,
  data?: T
): ResponseData<T> {
  return {
    status,
    status_code,
    message,
    data,
  };
}
