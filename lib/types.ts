export interface LinkWithClicks {
  id: string;
  originalUrl: string;
  customAlias: string | null;
  createdAt: Date;
  expiresAt: Date | null;
  _count: {
    clicks: number;
  };
}

export interface LinkStats {
  link: {
    id: string;
    originalUrl: string;
    customAlias: string | null;
    createdAt: Date;
  };
  stats: {
    totalClicks: number;
    todayClicks: number;
    referrers: { name: string | null; count: number }[];
    devices: { name: string | null; count: number }[];
    countries: { name: string | null; count: number }[];
    timeline: { date: string; clicks: number }[];
  };
}

export interface TagWithCount {
  name: string;
  _count: {
    links: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
