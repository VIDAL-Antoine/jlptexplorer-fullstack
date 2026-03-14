'use client';

import { useEffect, useId, useRef } from 'react';
import { loadYouTubeApi, type YTPlayer } from '../../lib/youtube';

const YT_PLAYING = 1;

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

      new window.YT.Player(elementId, {
        videoId,
        playerVars: {
          start: startTime,
          end: endTime,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (!cancelled) playerRef.current = event.target;
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(startTime, true);
              event.target.playVideo();
            }
          },
        },
      });
    });

    // Poll every 500ms to block seeks outside [startTime, endTime]
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      if (player.getPlayerState() !== YT_PLAYING) return;

      const t = player.getCurrentTime();
      if (t < startTime || t > endTime) {
        player.seekTo(startTime, true);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearInterval(interval);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, startTime, endTime]);

  return <div id={elementId} style={{ width: '100%', height: '100%' }} />;
}
