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

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  isActive: boolean;
}

export interface SiteSection {
  id: string;
  title: string;
  content: string;
  isVisible: boolean;
  order: number;
}

export interface StyleSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  borderRadius: string;
}

export interface SiteSettings {
  title: string;
  logo: string;
  font: string;
  banners: Banner[];
  sections: SiteSection[];
  styles: StyleSettings;
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
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  addSection: (section: SiteSection) => void;
  updateSection: (id: string, updates: Partial<SiteSection>) => void;
  deleteSection: (id: string) => void;
  updateStyles: (styles: Partial<StyleSettings>) => void;
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

const defaultSiteSettings: SiteSettings = {
  title: 'CS2 КЕЙСЫ',
  logo: '🎮',
  font: 'Rubik',
  banners: [
    {
      id: '1',
      title: 'Добро пожаловать!',
      description: 'Открывай кейсы и получай легендарные скины CS2',
      image: '',
      isActive: true,
    },
  ],
  sections: [
    {
      id: '1',
      title: 'Топ кейсы',
      content: 'Самые популярные кейсы с лучшими скинами',
      isVisible: true,
      order: 1,
    },
    {
      id: '2',
      title: 'Новинки',
      content: 'Свежие кейсы с новыми скинами',
      isVisible: true,
      order: 2,
    },
  ],
  styles: {
    primaryColor: '#ff6b35',
    secondaryColor: '#f72585',
    accentColor: '#7209b7',
    backgroundColor: '#0a0a0a',
    cardColor: '#1a1a1a',
    borderRadius: '12px',
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cases: initialCases,
      siteSettings: defaultSiteSettings,
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
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: { 
              ...defaultSiteSettings, 
              ...currentSettings, 
              ...settings,
              banners: currentSettings.banners || defaultSiteSettings.banners,
              sections: currentSettings.sections || defaultSiteSettings.sections,
              styles: currentSettings.styles || defaultSiteSettings.styles,
            },
          };
        }),
      addBanner: (banner) =>
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              banners: [...(currentSettings.banners || []), banner],
            },
          };
        }),
      updateBanner: (id, updates) =>
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              banners: (currentSettings.banners || []).map((b) =>
                b.id === id ? { ...b, ...updates } : b
              ),
            },
          };
        }),
      deleteBanner: (id) =>
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              banners: (currentSettings.banners || []).filter((b) => b.id !== id),
            },
          };
        }),
      addSection: (section) =>
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              sections: [...(currentSettings.sections || []), section],
            },
          };
        }),
      updateSection: (id, updates) =>
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              sections: (currentSettings.sections || []).map((s) =>
                s.id === id ? { ...s, ...updates } : s
              ),
            },
          };
        }),
      deleteSection: (id) =>
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              sections: (currentSettings.sections || []).filter((s) => s.id !== id),
            },
          };
        }),
      updateStyles: (styles) =>
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              styles: { ...(currentSettings.styles || defaultSiteSettings.styles), ...styles },
            },
          };
        }),
    }),
    {
      name: 'cs2-cases-storage',
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState.siteSettings) {
          return {
            ...persistedState,
            siteSettings: defaultSiteSettings,
          };
        }
        
        return {
          ...persistedState,
          siteSettings: {
            ...defaultSiteSettings,
            ...persistedState.siteSettings,
            banners: persistedState.siteSettings.banners || defaultSiteSettings.banners,
            sections: persistedState.siteSettings.sections || defaultSiteSettings.sections,
            styles: persistedState.siteSettings.styles || defaultSiteSettings.styles,
          },
        };
      },
    }
  )
);