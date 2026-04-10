export interface MasterDataStatus {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface MasterDataCertification {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface MasterDataLanguage {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface MasterDataFormat {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface MasterDataResponse {
  success: boolean;
  message: string;
  data: {
    movieReleaseStatuses: MasterDataStatus[];
    certifications: MasterDataCertification[];
    languages: MasterDataLanguage[];
    formats: MasterDataFormat[];
    additionalData: null | any;
  };
  timestamp: string;
}
