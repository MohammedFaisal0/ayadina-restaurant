"use client";

import Image from "next/image";

type SmartImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function isLocalImage(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

export function SmartImage({
  src,
  alt,
  fill,
  className = "",
  sizes,
  priority,
}: SmartImageProps) {
  if (isLocalImage(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? undefined : "lazy"}
          className={`absolute inset-0 size-full object-cover ${className}`}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? undefined : "lazy"}
        className={className}
      />
    );
  }

  const loading = priority ? undefined : ("lazy" as const);

  if (fill) {
    return <Image src={src} alt={alt} className={className} sizes={sizes} priority={priority} loading={loading} fill />;
  }

  return <Image src={src} alt={alt} className={className} sizes={sizes} priority={priority} loading={loading} width={800} height={600} />;
}
