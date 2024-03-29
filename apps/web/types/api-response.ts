export interface ApiResponseType {
  statusCode: number;
  data?: { [key: string]: any };
  message: string;
  success: boolean;
}
