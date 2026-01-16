import CreateImage from "../components/slider/CreateImage.tsx";
import UpcommingEvents from "../app/services/events/components/UpcommingEvents.tsx";
import MenuAccordionListe from "../components/menu/MenuAccordionListe.tsx";
import { images, type ImageItem } from "../helpers/functions/image.ts";
import Slider from "../components/slider/Slider.tsx";
import "./welcomePage.css";
import { useThema } from "../context/ThemaContext.tsx";

function WelcomePage() {
  const { thema } = useThema();
  return (
    <div
      className={`min-h-screen ${
        thema === "dark"
          ? "bg-white text-gray-800"
          : "bg-gray-900 text-yellow-300"
      }`}
    >
      <MenuAccordionListe />
      <div className="flex flex-col md:flex-row mx-auto max-w-[95vw] 2xl:max-w-[1800px] sm:ml-64 px-4">
        <section
          className="
  flex-1
  bg-gradient-to-b from-gray-700 to-gray-800
  text-center
  rounded-2xl
  shadow-2xl
  p-10
  mt-8
"
        >
          <div className="flex gap-2 flex-col justify-center items-center pb-6 rounded-lg shadow-md bg-gray-600 mb-4">
            <h1 className="text-2xl lg:text-6xl font-bold m-6 text-yellow-300">
              Welcome to EventMap
            </h1>

            <Slider
              items={images}
              itemsToShow={5}
              autoplay={false}
              autoplayDelay={2000}
              renderItem={(item: ImageItem) => <CreateImage src={item.src} />}
            />
          </div>

          <div className="w-full ">
            <div className="mx-auto h-40 max-lg:rounded-xl bg-[url('/berlin.webp')] bg-no-repeat bg-center md:bg-center-top  md:w-[40vw] lg:h-screen  bg-cover shaped"></div>
            <div className="content text-left p-8 ">
              <p className="max-w-2xl text-3xl text-yellow-200 mb-10">
                Discover and share events happening around you! Whether you're
                into music, sports, culture, or just looking for something fun
                to do, EventMap has got you covered.
              </p>
              <p className="max-w-2xl text-3xl text-yellow-200 mb-10">
                Use the menu to explore events by category and find out what's
                happening in your area.
              </p>
              <p className="max-w-2xl text-3xl text-yellow-200 mb-10">
                Get started by selecting a category from the menu on the left!
              </p>
            </div>
          </div>
        </section>

        <aside className=" p-6 w-full md:w-1/3 justify-center items-center md:border-l ">
          <UpcommingEvents />
        </aside>
      </div>
    </div>
  );
}

export default WelcomePage;
