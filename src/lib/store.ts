import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CaseItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: string;
}

export interface CaseData {
  id: string;
  name: string;
  image: string;
  price: number;
  items: CaseItem[];
}

export interface SiteSettings {
  title: string;
  logo: string;
  font: string;
}

interface StoreState {
  cases: CaseData[];
  siteSettings: SiteSettings;
  setCases: (cases: CaseData[]) => void;
  addCase: (caseData: CaseData) => void;
  updateCase: (id: string, updates: Partial<CaseData>) => void;
  deleteCase: (id: string) => void;
  addItemToCase: (caseId: string, item: CaseItem) => void;
  updateCaseItem: (caseId: string, itemId: string, updates: Partial<CaseItem>) => void;
  deleteCaseItem: (caseId: string, itemId: string) => void;
  setSiteSettings: (settings: Partial<SiteSettings>) => void;
}

const initialCases: CaseData[] = [
  {
    id: '1',
    name: 'Легендарный кейс',
    image: '🔥',
    price: 500,
    items: [
      { id: '1-1', name: 'AWP | Dragon Lore', price: 10000, image: '🔫', rarity: 'legendary' },
      { id: '1-2', name: 'AK-47 | Fire Serpent', price: 5000, image: '🔫', rarity: 'rare' },
      { id: '1-3', name: 'M4A4 | Howl', price: 8000, image: '🔫', rarity: 'legendary' },
      { id: '1-4', name: 'Butterfly Knife', price: 15000, image: '🔪', rarity: 'legendary' },
      { id: '1-5', name: 'Glock | Fade', price: 2000, image: '🔫', rarity: 'common' },
    ]
  },
  {
    id: '2',
    name: 'Эпический кейс',
    image: '⚡',
    price: 300,
    items: [
      { id: '2-1', name: 'Desert Eagle | Blaze', price: 3000, image: '🔫', rarity: 'rare' },
      { id: '2-2', name: 'USP-S | Kill Confirmed', price: 2500, image: '🔫', rarity: 'rare' },
      { id: '2-3', name: 'MP9 | Bulldozer', price: 100, image: '🔫', rarity: 'common' },
      { id: '2-4', name: 'P250 | Asiimov', price: 500, image: '🔫', rarity: 'common' },
      { id: '2-5', name: 'Karambit | Fade', price: 12000, image: '🔪', rarity: 'legendary' },
    ]
  },
  {
    id: '3',
    name: 'Стартовый кейс',
    image: '💎',
    price: 100,
    items: [
      { id: '3-1', name: 'FAMAS | Djinn', price: 800, image: '🔫', rarity: 'common' },
      { id: '3-2', name: 'Galil | Chatterbox', price: 600, image: '🔫', rarity: 'common' },
      { id: '3-3', name: 'MAC-10 | Neon Rider', price: 400, image: '🔫', rarity: 'common' },
      { id: '3-4', name: 'Five-SeveN | Monkey', price: 200, image: '🔫', rarity: 'common' },
      { id: '3-5', name: 'M4A1-S | Cyrex', price: 1500, image: '🔫', rarity: 'rare' },
    ]
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cases: initialCases,
      siteSettings: {
        title: 'CS2 КЕЙСЫ',
        logo: '🎮',
        font: 'Rubik',
      },
      setCases: (cases) => set({ cases }),
      addCase: (caseData) =>
        set((state) => ({
          cases: [...state.cases, caseData],
        })),
      updateCase: (id, updates) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCase: (id) =>
        set((state) => ({
          cases: state.cases.filter((c) => c.id !== id),
        })),
      addItemToCase: (caseId, item) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, items: [...c.items, item] } : c
          ),
        })),
      updateCaseItem: (caseId, itemId, updates) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  items: c.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              : c
          ),
        })),
      deleteCaseItem: (caseId, itemId) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? { ...c, items: c.items.filter((item) => item.id !== itemId) }
              : c
          ),
        })),
      setSiteSettings: (settings) =>
        set((state) => ({
          siteSettings: { ...state.siteSettings, ...settings },
        })),
    }),
    {
      name: 'cs2-cases-storage',
    }
  )
);
