import React from "react";
import Image from "next/image";

export const PetHeader = () => {
  return (
    <div className="relative w-40 h-40 shrink-0">
      <Image
        src="/images/cat/cat_idle.webp"
        alt="cat"
        fill
        className="object-contain rounded-md"
        sizes="(max-width: 768px) 100px, 160px"
        priority
      />
    </div>
  );
};
