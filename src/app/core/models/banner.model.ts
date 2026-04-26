export interface BannerButton {
  title: string;
  redirectLink: string;
  buttonType: 'primary' | 'secondary';
  openInNewTab: boolean;
}

export interface DisplayConfig {
  showTitle: boolean;
  showDescription: boolean;
  showButtons: boolean;
}

export interface Banner {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  imageAltText: string;
  order: number;
  buttons: BannerButton[];
  displayConfig?: DisplayConfig;
}

export interface BannerApiResponse {
  success: boolean;
  message: string;
  data: Banner[];
  timestamp: string;
}
