export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: 'TEES' | 'HOODIES' | 'TOTES' | 'ARCHIVE';
  imageUrl: string;
  description: string;
  isLimited?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  stockStatus: 'IN_STOCK' | 'SOLD_OUT' | 'RESTOCKING';
}

export interface VaultEntry {
  id: string;
  imageUrl: string;
  handle: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface StoryEntry {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
}

export interface ArchiveEntry {
  id: string;
  title: string;
  season: string;
  description: string;
  imageUrl: string;
}

