// Types para la API ARquiler

export interface ArquilerCalculateRequest {
  amount: number;
  date: string; // YYYY-MM-DD
  months: number;
  rate: 'icl' | 'ipc' | 'is' | 'ipim' | 'casa_propia' | 'cac' | 'cer' | 'uva';
}

export interface ArquilerCalculateDetail {
  date: string;
  value: number;
  month_before: number;
  accumulate: number;
}

export interface ArquilerCalculateDataItem {
  date: string;
  value: number;
  estimated: boolean;
  dif: number;
  amount: number;
  details: ArquilerCalculateDetail[];
}

export interface ArquilerCalculateResponse {
  success: boolean;
  data: ArquilerCalculateDataItem[];
}
