import { useContext, type ReactNode,useState,useCallback, useEffect } from 'react';
import {MenuContext} from '../../context/MenuContext'
import { NavLink, useMatch } from 'react-router-dom';

function MenuAccordion({children}: {children: ReactNode}) {
  const [activeGroup, setActiveGroup] = useState<string | undefined>(undefined);
  const switchGroup=useCallback((title: string) => {
    setActiveGroup((activeTitle) => (activeTitle === title ? undefined : title));
  }, []);
 
  return (
    <MenuContext.Provider value={{ activeGroup, switchGroup }}>
      {children}
    </MenuContext.Provider>
  )
};
MenuAccordion.Group = function ({ children, title }: {children: ReactNode, title: string}) {
  const { activeGroup, switchGroup } = useContext(MenuContext)!;
  const panelId = `panel-${title}`;

  return (
    <div className="flex flex-col">
      <button
        className="p-2 mb-2 "
        aria-expanded={activeGroup === title}
        aria-controls={panelId}
        onClick={() => switchGroup(title)}
      >
        {title}
      </button>

      <div
        id={panelId}
        className={`transition-all overflow-hidden ${
          activeGroup === title ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-4">{children}</div>
      </div>
    </div>
  );
};


MenuAccordion.Item = function MenuAccordionItem({ title, to }: {
  title: string;
  to: string;
}) {
   const match = useMatch(`${to}/*`);
  return (
     <NavLink
      to={to}
      className={
        match
          ? "p-2 mb-2 block bg-gray-300 rounded"
          : "p-2 mb-2 block hover:bg-gray-200 rounded"
      }
    >
      {title}
    </NavLink>
//    <NavLink
//   to={to}
//   end={false}
//   className={({ isActive }) =>
//     isActive
//       ? "p-2 mb-2 block bg-gray-300 rounded"
//       : "p-2 mb-2 block hover:bg-gray-200 rounded"
//   }
// >
//   {title}
// </NavLink>
  );
};
export default MenuAccordion

