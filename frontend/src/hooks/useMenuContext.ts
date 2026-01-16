import { MenuContext } from "../context/MenuContext";
import { useContext } from "react";
function useMenuContext() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error(
      'MenuAccordion.Group must be used within <MenuAccordion>'
    );
  }

  return context;
}

export default useMenuContext;