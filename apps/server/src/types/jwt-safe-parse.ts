export interface JwtSafeParse {
  success: boolean;
  isExpired: boolean;
  isInvalid: boolean;
  payload: any;
}
