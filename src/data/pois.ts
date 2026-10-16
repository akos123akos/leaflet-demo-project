export type PoiCategory = 'landmark' | 'museum' | 'bath' | 'food';

export const CATEGORY_STYLE: Record<PoiCategory, { emoji: string; color: string; label: string }> = {
  landmark: { emoji: '🏛️', color: '#2563eb', label: 'Landmarks' },
  museum: { emoji: '🖼️', color: '#9333ea', label: 'Museums' },
  bath: { emoji: '♨️', color: '#0891b2', label: 'Thermal baths' },
  food: { emoji: '🍽️', color: '#ea580c', label: 'Food & drink' },
};
