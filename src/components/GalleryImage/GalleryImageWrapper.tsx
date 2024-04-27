import type { ReactNode } from "react";
import { useState } from "react";

interface GalleryImageProps {
  children?: ReactNode;
}

const GalleryImage = ({ children }: GalleryImageProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};

export default GalleryImage;
