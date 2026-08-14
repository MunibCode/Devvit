"use client";
import { IKVideo } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

type VideoTypes = {
  path: string;
  className?: string;
};

const normalizePath = (path: string) => {
  if (!path) return "/";
  if (/^https?:\/\//.test(path) || path.startsWith("data:") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
};

const Video = ({ path, className }: VideoTypes) => {
  const src = normalizePath(path);

  if (urlEndpoint) {
    return (
      <IKVideo
        urlEndpoint={urlEndpoint}
        path={path}
        className={className}
        transformation={[
          { width: "1920", height: "1080", q: "90" },
          { raw: "l-text,i-Devvit,fs-100,co-white,l-end" },
        ]}
        controls
      />
    );
  }

  return <video src={src} className={className} controls />;
};

export default Video;
