import React from "react";

export default function ({ images }) {
  return (
    <>
      {images.map((image, index) => (
        <span key={index}>
          <img
            height={60}
            width={75}
            src={URL.createObjectURL(image)}
            alt={image.name}
          />
        </span>
      ))}
    </>
  );
}
