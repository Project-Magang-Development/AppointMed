import React, { useEffect, useRef } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  width?: string;
  height?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  width = "560",
  height = "315",
}) => {
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      // Mulai ulang video saat komponen dimuat
      player.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "playVideo",
          args: [],
        }),
        "*"
      );

      // Daftarkan event listener untuk memulai ulang video saat selesai diputar
      const handleVideoEnd = () => {
        player.contentWindow?.postMessage(
          JSON.stringify({
            event: "command",
            func: "playVideo",
            args: [],
          }),
          "*"
        );
      };

      player.addEventListener("ended", handleVideoEnd);

      // Bersihkan event listener saat komponen dibongkar
      return () => {
        player.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [videoId]);

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        maxWidth: "100%",
        maxHeight: "100px",

        background: "#000",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "20px",
      }}
    >
      <iframe
        ref={playerRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&fs=0&iv_load_policy=3&disablekb=1&playsinline=1&showInfo=0&autohide=1&enablejsapi=1`}
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
        rel="0"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
