import {create} from "zustand"


type MobileSidebarStore = {
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
};



export const useCardModal
 = create<MobileSidebarStore>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({isOpen: true, id}),
    onClose: () => set({isOpen: false, id: undefined}),
}))