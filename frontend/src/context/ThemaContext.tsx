import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

export const ThemaContext = createContext({
  thema: systemPrefersDark ? "dark" : "light",
  bgClass: "",
  toggleThema: () => {},
});

export const ThemaProvider = ({ children }: { children: React.ReactNode }) => {
  const [thema, setThema] = useState(systemPrefersDark ? "dark" : "light");
  const location = useLocation();
  const [bgClass, setBgClass] = useState("");

  // Переключение темы
  const toggleThema = useCallback(() => {
    setThema((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Карта фоновых классов
  const backgroundMap: Record<string, string> = {
    "/": "bg-startseite",
    "/map": "bg-map",
    "/login": "bg-login",
    "/register": "bg-register",
    "/events": "bg-events",
    "/profile": "bg-profile",
    "/*": "bg-default",
  };

  // Обновляем фон и title при изменении пути или темы
  useEffect(() => {
    const baseClass = backgroundMap[location.pathname] || "bg-default";
    const combined = `${baseClass} ${thema}`;
    setBgClass(combined);

    document.title = `EVENTS IN BERLIN | ${
      backgroundMap[location.pathname]
        ? backgroundMap[location.pathname].replace("bg-", "").toUpperCase()
        : ""
    }`;
  }, [location.pathname, thema]);

 

  return (
    <ThemaContext.Provider value={{ thema, toggleThema, bgClass }}>
      {children}
    </ThemaContext.Provider>
  );
};

// Хук для удобного доступа
export function useThema() {
  const context = useContext(ThemaContext);
  if (!context) {
    throw new Error("useThema must be used within a ThemaProvider");
  }
  return context;
}
