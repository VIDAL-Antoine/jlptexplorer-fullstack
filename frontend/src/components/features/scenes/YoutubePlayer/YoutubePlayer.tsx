'use client';

import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Stack, Text } from '@mantine/core';
import { useConsent } from '@/contexts/ConsentContext';
import { loadYouTubeApi, type YTPlayer } from '@/lib/youtube';

const YT_PLAYING = 1;

interface YoutubePlayerProps {
  videoId: string;
  startTime: number;
  endTime: number;
}

export interface YoutubePlayerHandle {
  seekTo: (time: number) => void;
}

export const YoutubePlayer = forwardRef<YoutubePlayerHandle, YoutubePlayerProps>(
  ({ videoId, startTime, endTime }, ref) => {
    const t = useTranslations('YoutubePlayer');
    const { isYoutubeAccepted, showPreferences } = useConsent();
    const uid = useId().replace(/:/g, '');
    const elementId = `yt-player-${uid}`;
    const playerRef = useRef<YTPlayer | null>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        playerRef.current?.seekTo(time, true);
        playerRef.current?.playVideo();
      },
    }));

    useEffect(() => {
      if (!isYoutubeAccepted) return;

      let cancelled = false;

      loadYouTubeApi().then(() => {
        if (cancelled) {
          return;
        }

        new window.YT.Player(elementId, {
          videoId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            start: startTime,
            end: endTime,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              if (!cancelled) {
                playerRef.current = event.target;
              }
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
        if (!player) {
          return;
        }
        if (player.getPlayerState() !== YT_PLAYING) {
          return;
        }

        const currentTime = player.getCurrentTime();
        if (currentTime < startTime || currentTime > endTime) {
          player.seekTo(startTime, true);
        }
      }, 500);

      return () => {
        cancelled = true;
        clearInterval(interval);
        const iframe = document.getElementById(elementId) as HTMLIFrameElement | null;
        if (iframe) {
          iframe.src = '';
        }
        playerRef.current?.destroy();
        playerRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId, startTime, endTime, isYoutubeAccepted]);

    if (!isYoutubeAccepted) {
      return (
        <Stack justify="center" align="center">
          <Text size="sm" c="dimmed" ta="center">
            {t('cookiesRequired')}
          </Text>
          <Button size="xs" variant="light" onClick={showPreferences}>
            {t('managePreferences')}
          </Button>
        </Stack>
      );
    }

    return <div id={elementId} style={{ width: '100%', height: '100%' }} />;
  }
);
