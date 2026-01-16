import MenuAccordion from "./MenuAccordion";
import { EVENT_CATEGORIES, type EventCategory } from "@event-map/shared";

function MenuAccordionListe() {

  return (
    <aside
  className="
    sm:absolute sm:left-0 sm:top-0
    w-full sm:w-64 h-full
    max-sm:bg-gradient-to-b from-green-100 via-teal-100 to-blue-200
    sm:bg-[rgba(30,167,188,0.2)]
    transition-transform duration-300
    sm:backdrop-blur-xl
    flex flex-wrap sm:flex-col
    gap-2
    p-2
  "
>
      <MenuAccordion>
        {(Object.entries(EVENT_CATEGORIES) as [
          EventCategory,
          (typeof EVENT_CATEGORIES)[EventCategory]
        ][]).map(([categoryKey, categoryValue]) => (
          <MenuAccordion.Group
            key={categoryKey}
            title={categoryKey} 
            label={categoryValue.label} 
          >
            <div className="flex sm:flex-col gap-0 overflow-x-auto ">
            {categoryValue.subcategories.map((sub) => (
              <MenuAccordion.Item
                key={sub}
                title={sub}
                to={`/events/${categoryKey}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
              />
            ))}
            </div>
          </MenuAccordion.Group>
        ))}
      </MenuAccordion>
    </aside>
  );
}

export default MenuAccordionListe;
