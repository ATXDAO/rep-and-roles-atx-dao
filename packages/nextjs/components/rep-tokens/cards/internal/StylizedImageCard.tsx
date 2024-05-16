// import Image from "next/image";
import { Color } from "./deprecated/Stylized";

export interface ImageCardPropsInternal {
  src: string;
  alt?: string;
  imageClassName?: string;
  color?: Color;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
}

const sizeMap = {
  xs: 32,
  sm: 64,
  base: 256,
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
};

const cardSizeMap = {
  xs: "p-1",
  sm: "p-2",
  base: "p-2",
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
};

export const StylizedImageCard = ({ src, alt = "Token Image", size = "base" }: ImageCardPropsInternal) => {
  {
    /* eslint-disable-next-line @next/next/no-img-element */
  }
  const o = <img className="rounded-lg mx-auto" src={src} alt={alt} width={sizeMap[size]} height={sizeMap[size]} />;
  return <div className={`rounded-lg bg-base-300 ${cardSizeMap[size]}`}>{src ? o : <></>}</div>;
};
