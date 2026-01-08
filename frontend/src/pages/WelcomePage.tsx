
import MenuAccordionListe from "../components/menu/MenuAccordionListe.tsx";

function WelcomePage() {

  return (
    <div className="flex  ">
     {/* {isLoading && <Loader />} */}
  <MenuAccordionListe />
    <section className="w-1/2 p-4 ">
      <h1 className="text-3xl font-bold mb-4">Welcome to EventMap</h1>
      <p className="mb-4">
        Discover and share events happening around you! Whether you're into 
        music, sports, culture, or just looking for something fun to do, EventMap
        has got you covered.
      </p>
      <p className="mb-4">
        Use the menu to explore events by category and find out what's happening 
        in your area. You can also create your own events and share them with the community.
      </p>
      <p className="mb-4">
        Get started by selecting a category from the menu on the left!
      </p>
    </section>
   <aside className="w-1/4 p-4 border-l">
      {/* Right sidebar content can go here */}
      <h2>
        Upcoming Events
      </h2>
   </aside>
     

    </div>
  );
}

export default WelcomePage