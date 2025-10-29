import { create } from 'zustand';

export interface ComponentLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CertificateComponent {
  id: string;
  type: 'text' | 'signature' | 'image' | 'date' | 'qrcode';
  label: string;
  content: string;
  dataKey?: string; // For dynamic data binding
  layout: ComponentLayout;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface CertificatePage {
  pageNumber: number;
  backgroundImage?: string;
  components: CertificateComponent[];
}

export interface CertificateTemplate {
  id: string;
  templateName: string;
  pages: CertificatePage[];
  gridCols?: number;
  gridRows?: number;
}

export interface DynamicData {
  [key: string]: string | number;
}

interface CertificateStore {
  template: CertificateTemplate | null;
  dynamicData: DynamicData;
  currentPage: number;
  selectedComponentId: string | null;

  // Template actions
  setTemplate: (template: CertificateTemplate) => void;
  createNewTemplate: () => void;
  updateComponentLayout: (pageNumber: number, componentId: string, layout: ComponentLayout) => void;
  updateComponent: (pageNumber: number, componentId: string, updates: Partial<CertificateComponent>) => void;
  addComponent: (pageNumber: number, component: CertificateComponent) => void;
  removeComponent: (pageNumber: number, componentId: string) => void;

  // Page actions
  setCurrentPage: (pageNumber: number) => void;
  addPage: () => void;
  removePage: (pageNumber: number) => void;

  // Data actions
  setDynamicData: (data: DynamicData) => void;
  updateDynamicData: (key: string, value: string | number) => void;

  // Selection
  setSelectedComponent: (componentId: string | null) => void;
}

const defaultTemplate: CertificateTemplate = {
  id: 'default-1',
  templateName: 'Sertifikat Pelatihan',
  gridCols: 12,
  gridRows: 12,
  pages: [
    {
      pageNumber: 1,
      components: [
        {
          id: 'title-1',
          type: 'text',
          label: 'Judul',
          content: 'SERTIFIKAT PENGHARGAAN',
          layout: { x: 1, y: 1, w: 10, h: 1 },
          fontSize: 32,
          fontFamily: 'Arial',
          color: '#000000',
          alignment: 'center',
        },
        {
          id: 'name-1',
          type: 'text',
          label: 'Nama Peserta',
          content: 'Nama Peserta',
          dataKey: 'participantName',
          layout: { x: 2, y: 4, w: 8, h: 1 },
          fontSize: 24,
          fontFamily: 'Arial',
          color: '#000000',
          alignment: 'center',
        },
        {
          id: 'desc-1',
          type: 'text',
          label: 'Deskripsi',
          content: 'Telah menyelesaikan program pelatihan dengan sukses',
          layout: { x: 1, y: 6, w: 10, h: 1 },
          fontSize: 14,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'center',
        },
        {
          id: 'sig-1',
          type: 'signature',
          label: 'Tanda Tangan Direktur',
          content: 'Direktur',
          layout: { x: 2, y: 9, w: 3, h: 2 },
        },
        {
          id: 'date-1',
          type: 'date',
          label: 'Tanggal',
          content: new Date().toLocaleDateString('id-ID'),
          dataKey: 'certificateDate',
          layout: { x: 7, y: 9, w: 3, h: 1 },
          fontSize: 12,
          alignment: 'center',
        },
      ],
    },
  ],
};

export const useCertificateStore = create<CertificateStore>((set) => ({
  template: defaultTemplate,
  dynamicData: {
    participantName: 'John Doe',
    certificateDate: new Date().toLocaleDateString('id-ID'),
  },
  currentPage: 1,
  selectedComponentId: null,

  setTemplate: (template) => set({ template }),

  createNewTemplate: () => set({ template: defaultTemplate }),

  updateComponentLayout: (pageNumber, componentId, layout) =>
    set((state) => {
      if (!state.template) return state;
      const updatedTemplate = { ...state.template };
      const page = updatedTemplate.pages.find((p) => p.pageNumber === pageNumber);
      if (page) {
        const component = page.components.find((c) => c.id === componentId);
        if (component) {
          component.layout = layout;
        }
      }
      return { template: updatedTemplate };
    }),

  updateComponent: (pageNumber, componentId, updates) =>
    set((state) => {
      if (!state.template) return state;
      const updatedTemplate = { ...state.template };
      const page = updatedTemplate.pages.find((p) => p.pageNumber === pageNumber);
      if (page) {
        const component = page.components.find((c) => c.id === componentId);
        if (component) {
          Object.assign(component, updates);
        }
      }
      return { template: updatedTemplate };
    }),

  addComponent: (pageNumber, component) =>
    set((state) => {
      if (!state.template) return state;
      const updatedTemplate = { ...state.template };
      const page = updatedTemplate.pages.find((p) => p.pageNumber === pageNumber);
      if (page) {
        page.components.push(component);
      }
      return { template: updatedTemplate };
    }),

  removeComponent: (pageNumber, componentId) =>
    set((state) => {
      if (!state.template) return state;
      const updatedTemplate = { ...state.template };
      const page = updatedTemplate.pages.find((p) => p.pageNumber === pageNumber);
      if (page) {
        page.components = page.components.filter((c) => c.id !== componentId);
      }
      return { template: updatedTemplate };
    }),

  setCurrentPage: (pageNumber) => set({ currentPage: pageNumber }),

  addPage: () =>
    set((state) => {
      if (!state.template) return state;
      const updatedTemplate = { ...state.template };
      const newPageNumber = Math.max(...updatedTemplate.pages.map((p) => p.pageNumber)) + 1;
      updatedTemplate.pages.push({
        pageNumber: newPageNumber,
        components: [],
      });
      return { template: updatedTemplate };
    }),

  removePage: (pageNumber) =>
    set((state) => {
      if (!state.template) return state;
      const updatedTemplate = { ...state.template };
      updatedTemplate.pages = updatedTemplate.pages.filter((p) => p.pageNumber !== pageNumber);
      return { template: updatedTemplate };
    }),

  setDynamicData: (data) => set({ dynamicData: data }),

  updateDynamicData: (key, value) =>
    set((state) => ({
      dynamicData: { ...state.dynamicData, [key]: value },
    })),

  setSelectedComponent: (componentId) => set({ selectedComponentId: componentId }),
}));
