import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAllData, saveCases, saveSettings, recordOpening } from './api';

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
  image?: string;
  link?: string;
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

export interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: string;
  isVisible: boolean;
  order: number;
}

export interface SiteSettings {
  title: string;
  logo: string;
  font: string;
  currencyIcon: string;
  banners: Banner[];
  sections: SiteSection[];
  navItems: NavItem[];
  styles: StyleSettings;
}

interface StoreState {
  cases: CaseData[];
  siteSettings: SiteSettings;
  isLoading: boolean;
  loadData: () => Promise<void>;
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
  addNavItem: (navItem: NavItem) => void;
  updateNavItem: (id: string, updates: Partial<NavItem>) => void;
  deleteNavItem: (id: string) => void;
  updateStyles: (styles: Partial<StyleSettings>) => void;
  recordCaseOpening: (caseId: string, itemId: string) => Promise<void>;
  syncToServer: () => Promise<void>;
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
  currencyIcon: '',
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
  navItems: [
    { id: '1', path: '/', label: 'Главная', icon: 'Home', isVisible: true, order: 1 },
    { id: '2', path: '/cases', label: 'Кейсы', icon: 'Package', isVisible: true, order: 2 },
    { id: '3', path: '/profile', label: 'Профиль', icon: 'User', isVisible: true, order: 3 },
    { id: '4', path: '/inventory', label: 'Инвентарь', icon: 'Backpack', isVisible: true, order: 4 },
    { id: '5', path: '/free', label: 'Халява', icon: 'Gift', isVisible: true, order: 5 },
    { id: '7', path: '/history', label: 'История', icon: 'History', isVisible: true, order: 6 },
    { id: '6', path: '/admin', label: 'Админ', icon: 'Settings', isVisible: true, order: 7 },
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
      isLoading: false,
      loadData: async () => {
        try {
          set({ isLoading: true });
          const data = await getAllData();
          
          const dbIsEmpty = (!data.cases || data.cases.length === 0) && 
                           (!data.settings || Object.keys(data.settings).length === 0);
          
          if (dbIsEmpty) {
            await saveCases(initialCases);
            await saveSettings(defaultSiteSettings);
            set({
              cases: initialCases,
              siteSettings: defaultSiteSettings,
              isLoading: false,
            });
          } else {
            const loadedCases = data.cases || get().cases || initialCases;
            const loadedSettings = data.settings && Object.keys(data.settings).length > 0 
              ? { ...defaultSiteSettings, ...data.settings } 
              : get().siteSettings || defaultSiteSettings;
            
            set({
              cases: loadedCases,
              siteSettings: loadedSettings,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Failed to load data:', error);
          set({ 
            isLoading: false 
          });
        }
      },
      syncToServer: async () => {
        try {
          const state = get();
          await saveCases(state.cases);
          await saveSettings(state.siteSettings);
        } catch (error) {
          console.error('Failed to sync to server:', error);
        }
      },
      recordCaseOpening: async (caseId: string, itemId: string) => {
        try {
          await recordOpening(caseId, itemId);
        } catch (error) {
          console.error('Failed to record opening:', error);
        }
      },
      setCases: (cases) => set({ cases }),
      addCase: (caseData) => {
        set((state) => ({
          cases: [...state.cases, caseData],
        }));
        get().syncToServer();
      },
      updateCase: (id, updates) => {
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
        get().syncToServer();
      },
      deleteCase: (id) => {
        set((state) => ({
          cases: state.cases.filter((c) => c.id !== id),
        }));
        get().syncToServer();
      },
      addItemToCase: (caseId, item) => {
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, items: [...c.items, item] } : c
          ),
        }));
        get().syncToServer();
      },
      updateCaseItem: (caseId, itemId, updates) => {
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
        }));
        get().syncToServer();
      },
      deleteCaseItem: (caseId, itemId) => {
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? { ...c, items: c.items.filter((item) => item.id !== itemId) }
              : c
          ),
        }));
        get().syncToServer();
      },
      setSiteSettings: (settings) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: { 
              ...defaultSiteSettings, 
              ...currentSettings, 
              ...settings,
              banners: currentSettings.banners || defaultSiteSettings.banners,
              sections: currentSettings.sections || defaultSiteSettings.sections,
              navItems: currentSettings.navItems || defaultSiteSettings.navItems,
              styles: currentSettings.styles || defaultSiteSettings.styles,
            },
          };
        });
        get().syncToServer();
      },
      addBanner: (banner) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              banners: [...(currentSettings.banners || []), banner],
            },
          };
        });
        get().syncToServer();
      },
      updateBanner: (id, updates) => {
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
        });
        get().syncToServer();
      },
      deleteBanner: (id) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              banners: (currentSettings.banners || []).filter((b) => b.id !== id),
            },
          };
        });
        get().syncToServer();
      },
      addSection: (section) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              sections: [...(currentSettings.sections || []), section],
            },
          };
        });
        get().syncToServer();
      },
      updateSection: (id, updates) => {
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
        });
        get().syncToServer();
      },
      deleteSection: (id) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              sections: (currentSettings.sections || []).filter((s) => s.id !== id),
            },
          };
        });
        get().syncToServer();
      },
      addNavItem: (navItem) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              navItems: [...(currentSettings.navItems || []), navItem],
            },
          };
        });
        get().syncToServer();
      },
      updateNavItem: (id, updates) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              navItems: (currentSettings.navItems || []).map((n) =>
                n.id === id ? { ...n, ...updates } : n
              ),
            },
          };
        });
        get().syncToServer();
      },
      deleteNavItem: (id) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              navItems: (currentSettings.navItems || []).filter((n) => n.id !== id),
            },
          };
        });
        get().syncToServer();
      },
      updateStyles: (styles) => {
        set((state) => {
          const currentSettings = state.siteSettings || defaultSiteSettings;
          return {
            siteSettings: {
              ...defaultSiteSettings,
              ...currentSettings,
              styles: { ...(currentSettings.styles || defaultSiteSettings.styles), ...styles },
            },
          };
        });
        get().syncToServer();
      },
    }),
    {
      name: 'cs2-cases-storage',
    }
  )
);