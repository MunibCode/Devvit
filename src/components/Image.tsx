"use client";

import { IKImage } from "imagekitio-next";

type ImageType = {
  path: string;
  w?: number;
  h?: number;
  alt: string;
  className?: string;
  tr?: boolean;
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const normalizePath = (path: string) => {
  if (!path) return "/";
  if (/^https?:\/\//.test(path) || path.startsWith("data:") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
};

const Image = ({ path, w, h, alt, className, tr }: ImageType) => {
  const src = normalizePath(path);

  if (urlEndpoint) {
    return (
      <IKImage
        urlEndpoint={urlEndpoint}
        path={path}
        {...(tr
          ? { transformation: [{ width: `${w}`, height: `${h}` }] }
          : { width: w, height: h })}
        lqip={{ active: true, quality: 20 }}
        alt={alt}
        className={className}
      />
    );
  }

  // Deliberate plain <img> fallback when ImageKit env vars are unset.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} width={w} height={h} />;
};

export default Image;
