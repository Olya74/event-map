import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
  type MouseEvent,
} from "react";
import { type SliderProps } from "./types";
import "./slider.css";

function Slider<T>({
  items,
  renderItem,
  itemsToShow = 1,
  autoplay = false,
  autoplayDelay = 3000,
}: SliderProps<T>) {
  const [index, setIndex] = useState(itemsToShow);
  const [transition, setTransition] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const startX = useRef(0);
  const isDragging = useRef(false);

  const itemWidth = 100 / itemsToShow;

  const extendedItems = [
    ...items.slice(-itemsToShow),
    ...items,
    ...items.slice(0, itemsToShow),
  ];

  // ▶ NEXT / PREV
  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  // ♻ infinite logic
  useEffect(() => {
    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(items.length);
      }, 500);
    }

    if (index === items.length + itemsToShow) {
      setTimeout(() => {
        setTransition(false);
        setIndex(itemsToShow);
      }, 500);
    }
  }, [index, items.length, itemsToShow]);

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  // ▶ autoplay
  useEffect(() => {
    if (!autoplay) return;

    const id = setInterval(next, autoplayDelay);
    return () => clearInterval(id);
  }, [autoplay, autoplayDelay]);

  // 👉 swipe handlers
  const onStart = (x: number) => {
    startX.current = x;
    isDragging.current = true;
  };

  const onEnd = (x: number) => {
    if (!isDragging.current) return;

    const diff = startX.current - x;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    isDragging.current = false;
  };

  return (
    <div className="flex items-center justify-center w-[90%] gap-3">
      <button onClick={prev}>◀</button>

      <div
        className="overflow-hidden w-full"
        onTouchStart={(e: TouchEvent) => onStart(e.touches[0].clientX)}
        onTouchEnd={(e: TouchEvent) => onEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e: MouseEvent) => onStart(e.clientX)}
        onMouseUp={(e: MouseEvent) => onEnd(e.clientX)}
      >
        <div
          ref={sliderRef}
          className="flex"
          style={{
            transform: `translateX(-${index * itemWidth}%)`,
            transition: transition ? "transform 0.5s ease-in-out" : "none",
          }}
        >
          {extendedItems.map((item, i) => (
            <div
              className="flex-shrink-0 aspect-[16/9] overflow-hidden"
              key={i}
              style={{ width: `${itemWidth}%` }}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      <button onClick={next}>▶</button>
    </div>
  );
}

export default Slider;
