interface apiResponse {
  statusCode: number;
  data?: { [key: string]: any };
  message: string;
  success: boolean;
}

export function apiResponse(
  statusCode: number,
  message: string,
  data?: { [key: string]: any }
): apiResponse {
  return {
    statusCode,
    message,
    data,
    success: statusCode >= 200 && statusCode < 300,
  };
}
