export enum QueryType {
  TRAFFIC = 'TRAFFIC',
  GAS = 'GAS',
  FOOD = 'FOOD',
  CUSTOM = 'CUSTOM'
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface MapSource {
  title: string;
  uri: string;
}

export interface AIResponse {
  id: string;
  type: QueryType;
  text: string;
  sources: MapSource[];
  timestamp: number;
  query: string;
}

export interface LoadingState {
  isActive: boolean;
  message: string;
}