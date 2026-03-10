'use client';

import { useEffect, useId, useRef } from 'react';
import { loadYouTubeApi, type YTPlayer } from '../../lib/youtube';

interface YoutubePlayerProps {
  videoId: string;
  startTime: number;
  endTime: number;
}

export function YoutubePlayer({ videoId, startTime, endTime }: YoutubePlayerProps) {
  const uid = useId().replace(/:/g, '');
  const elementId = `yt-player-${uid}`;
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled) return;

      playerRef.current = new window.YT.Player(elementId, {
        videoId,
        playerVars: {
          start: startTime,
          end: endTime,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(startTime, true);
              event.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, startTime, endTime]);

  return <div id={elementId} style={{ width: '100%', height: '100%' }} />;
}
