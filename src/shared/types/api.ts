export interface ApiResponse<T = any> {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
  };
  body: string;
}