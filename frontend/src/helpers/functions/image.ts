import img1 from "/bilnded_by_delight.jpg";
import img2 from "/e-1.jfif";
import img3 from "/e-2.jfif";
import img4 from "/e-3.jfif";
import img5 from "/e-4.jfif";
import img6 from "/e-5.avif";
import img7 from "/e-6.jfif";
import img8 from "/e-7.png";

export type ImageItem = {
  id: number;
  src: string;
};

export const images: ImageItem[] = [
  { id: 0, src: img1 },
  { id: 1, src: img2 },
  { id: 2, src: img3 },
  { id: 3, src: img4 },
  { id: 4, src: img5 },
  { id: 5, src: img6 },
  { id: 6, src: img7 },
  { id: 7, src: img8 },
];
