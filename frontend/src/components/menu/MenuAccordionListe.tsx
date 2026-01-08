
import MenuAccordion from './MenuAccordion'

function MenuAccordionListe() {
  return (
     <aside className="w-1/4  flex p-4">
   <MenuAccordion>
         <MenuAccordion.Group title="Children events">
           <MenuAccordion.Item title="birthdays" to="/events/birthdays"/>
           <MenuAccordion.Item title="school finishes" to="/events/school-finishes"/>
         </MenuAccordion.Group>
         <MenuAccordion.Group title="Culture">
           <MenuAccordion.Item title="movie" to="/events/movie"/>
           <MenuAccordion.Item title="theater" to="/events/theater"/>
           <MenuAccordion.Item title="concert" to="/events/concert"/>
           <MenuAccordion.Item title="exhibition" to="/events/exhibition"/>
         </MenuAccordion.Group>
         <MenuAccordion.Group title="Music">
            <MenuAccordion.Item title="rock" to="/events/rock"/>
            <MenuAccordion.Item title="pop" to="/events/pop"/>
            <MenuAccordion.Item title="classical" to="/events/classical"/>
            <MenuAccordion.Item title="jazz" to="/events/jazz"/>
         </MenuAccordion.Group>
         <MenuAccordion.Group title="Sports">
            <MenuAccordion.Item title="football" to="/events/football"/>
            <MenuAccordion.Item title="basketball" to="/events/basketball"/>
         </MenuAccordion.Group>
         <MenuAccordion.Group title="Tourism">
            <MenuAccordion.Item title="sightseeing" to="/events/sightseeing"/>
            <MenuAccordion.Item title="city tour" to="/events/city-tour"/>
            <MenuAccordion.Item title="museum" to="/events/museum"/>
        </MenuAccordion.Group>
       </MenuAccordion>
   </aside>
  )
}

export default MenuAccordionListe