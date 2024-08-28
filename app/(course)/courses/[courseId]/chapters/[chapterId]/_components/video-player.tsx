'use client';

import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Loader2, Lock, Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  title: string;
  videoUrl?: string | null;
}

export const VideoPlayer = ({
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  title,
  videoUrl,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = (state: { playedSeconds: number; loadedSeconds: number; played: number; loaded: number }) => {
    setPlayedSeconds(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const progressPercentage = (playedSeconds / duration) * 100;

  return (
    <div
      className="relative aspect-video"
      onClick={handlePlayPause}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click
    >
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">Ce chapitre est verrouillé.</p>
        </div>
      )}
      {!isLocked && (
        <>
          <ReactPlayer
            ref={playerRef}
            url={videoUrl?.toString()}
            controls={false} // Hide default controls
            width="100%"
            height="100%"
            onReady={() => setIsReady(true)}
            onProgress={handleProgress} // Update progress
            onDuration={handleDuration} // Update duration
            playing={isPlaying}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from propagating to the parent div
                  handlePlayPause();
                }}
                className="bg-secondary p-4 rounded-full"
              >
                <Play className="text-black h-8 w-8" />
              </button>
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex flex-col items-center">
            <div className="relative w-full bg-gray-800 h-2 rounded-full">
              <div
                className="absolute top-0 left-0 bg-secondary h-full rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
