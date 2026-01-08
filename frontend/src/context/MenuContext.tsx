import {createContext} from 'react'

type MenuContextType = {
  activeGroup?: string;
  switchGroup: (title: string) => void;
};
const MenuContext = createContext<MenuContextType | undefined>(undefined);

export { MenuContext };