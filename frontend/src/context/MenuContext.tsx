import {createContext} from 'react';
import { type EventCategory } from '@event-map/shared';

type MenuContextType = {
  activeCategory?: EventCategory;
  switchCategory: (category: EventCategory) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export { MenuContext };

