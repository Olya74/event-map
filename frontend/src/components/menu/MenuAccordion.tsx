import { type ReactNode, useState, useCallback } from "react";
import { MenuContext } from "../../context/MenuContext";
import { NavLink, useMatch } from "react-router-dom";
import type { EventCategory } from "@event-map/shared";
import useMenuContext from "../../hooks/useMenuContext";
import { useThema } from "../../context/ThemaContext";

function MenuAccordion<T>({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<
    EventCategory | undefined
  >(undefined);
  const switchCategory = useCallback((category: EventCategory) => {
    setActiveCategory((activeCategory) =>
      activeCategory === category ? undefined : category
    );
  }, []);

  return (
    <MenuContext.Provider value={{ activeCategory, switchCategory }}>
      {children}
    </MenuContext.Provider>
  );
}

MenuAccordion.Group = function ({
  children,
  title,
  label,
}: {
  children: ReactNode;
  title: EventCategory;
  label: string;
}) {
  const { activeCategory, switchCategory } = useMenuContext();
  const panelId = `panel-${title}`;
  const { thema } = useThema();
  return (
    <div
      className={`${
        thema === "dark"
          ? "sm:text-gray-800 sm:hover:text-yellow-300"
          : "sm:text-gray-100 text-amber-900 sm:hover:text-yellow-300"
      } text-lg w-44  mx-auto sm:mx-0 flex flex-col  sm:items-start`}
    >
      <button
        className="
    px-3 py-2 mt-4
    rounded-full
    bg-white/80
    font-semibold
    text-center
    w-full sm:w-full
    hover:bg-white
    transition
    sm:text-gray-800
  "
        aria-expanded={activeCategory === title}
        aria-controls={panelId}
        onClick={() => switchCategory(title)}
      >
        {label}
      </button>

      <div
        id={panelId}
        className={`transition-all overflow-hidden ${
          activeCategory === title ? "max-h-fit" : "max-h-0"
        }`}
      >
        <div
          className="
  grid grid-auto-rows grid-auto-cols grid-flow-dense 
  gap-2
  sm:flex sm:flex-col
  p-2
"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

MenuAccordion.Item = function MenuAccordionItem({
  title,
  to,
}: {
  title: string;
  to: string;
}) {
  const match = useMatch(`${to}/*`);
  return (
    <NavLink
      to={to}
      end={false}
      className={
        match
          ? "p-2 mb-2 block bg-gray-300 rounded"
          : "p-2 mb-2 block hover:text-gray-800 sm:hover:bg-gray-600 rounded transition transform hover:scale-125 sm:hover:font-semibold"
      }
    >
      {title}
    </NavLink>
  );
};
export default MenuAccordion;
