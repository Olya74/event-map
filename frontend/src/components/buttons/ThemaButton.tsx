import "./themaButton.css";
import { type FC } from "react";
import { useThema } from "../../context/ThemaContext";

const ThemaButton: FC = () => {
  const { thema, toggleThema } = useThema();
  return (
    <div
      className={`div-container div-container-${thema}`}
      onClick={toggleThema}
    >
      <div className={`div-wraper div-wraper-${thema}`}>
        <input
          className="inputToggle"
          type="checkbox"
          checked={thema === "dark"}
          onChange={toggleThema}
        />
      </div>
    </div>
  );
};
export default ThemaButton;
