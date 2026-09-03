"use client";

import Image, { ImageProps } from "next/image";
import { CSSProperties } from "react";

export interface MaskedImageProps extends Omit<ImageProps, "className"> {
  wrapperClassName?: string;
  imageClassName?: string;
  maskSrc?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
}

export default function MaskedImage({
  wrapperClassName = "",
  imageClassName = "",
  maskSrc = "/images/masks/maskelements.png",
  maskSize = "cover",
  maskPosition = "center",
  maskRepeat = "no-repeat",
  alt,
  style,
  ...imageProps
}: MaskedImageProps) {
  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url('${maskSrc}')`,
    maskImage: `url('${maskSrc}')`,
    WebkitMaskSize: maskSize,
    maskSize: maskSize,
    WebkitMaskPosition: maskPosition,
    maskPosition: maskPosition,
    WebkitMaskRepeat: maskRepeat,
    maskRepeat: maskRepeat,
    ...style,
  };

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={maskStyle}
    >
      <Image
        alt={alt}
        className={imageClassName}
        {...imageProps}
      />
    </div>
  );
}
