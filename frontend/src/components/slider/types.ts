export interface SliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsToShow?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
}
