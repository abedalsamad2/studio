export type DomainAvailability = {
  status: 'available' | 'taken' | 'unknown';
  registrar?: string;
  createdDate?: string;
  expiryDate?: string;
  nameServers?: string[];
  notes?: string;
};

export type KeywordData = {
  term: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  source: 'Google Ads' | 'Google Trends';
};
