import { useThema } from "../../context/ThemaContext";
import "./footer.css";
function Footer() {
 const { thema} = useThema();
  return (
    <footer className={`footer ${thema} flex flex-col  items-center  w-full text-center text-lg  lg:text-2xl font-bold py-4`}>
     <p> EVENTS IN BERLIN &copy; 2024</p>
     <p>&nbsp;</p>
     <address >
      Created by&nbsp;
      <a
        href="https://www.linkedin.com/in/sergei-bogdanov-927ba5232/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Olga Korkhova: &nbsp;
      </a>
      <a href="tel:++49 15906821571" className="underline">+49 159 068 21571</a>
     </address>
    </footer>
  );
}

export default Footer;