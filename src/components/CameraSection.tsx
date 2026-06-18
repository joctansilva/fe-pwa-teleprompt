'use client'
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { RecordingStatus } from '@/hooks/useRecording'

interface Props {
  stream: MediaStream | null
  isMirrored: boolean
  error: string | null
  isLoading: boolean
  script: string
  fontSize: number
  containerHeight: number
  teleprompterRef: RefObject<HTMLDivElement | null>
  recordingStatus: RecordingStatus
  duration: number
  onRetry: () => void
}

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) {
    return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function CameraSection({
  stream,
  isMirrored,
  error,
  isLoading,
  script,
  fontSize,
  containerHeight,
  teleprompterRef,
  recordingStatus,
  duration,
  onRetry,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  if (error) {
    return (
      <div className="aspect-video lg:aspect-auto lg:flex-1 lg:min-h-0 bg-gray-900 flex flex-col items-center justify-center p-6 text-center gap-4">
        <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
        <p className="text-red-400 text-sm max-w-xs">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="relative aspect-video lg:aspect-auto lg:flex-1 lg:min-h-0 bg-black overflow-hidden">
      {/* Camera video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
      />

      {/* Loading / no stream placeholder */}
      {!stream && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900">
          {isLoading ? (
            <>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Iniciando câmera…</p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Câmera não ativa</p>
          )}
        </div>
      )}

      {/* Recording indicator */}
      {(recordingStatus === 'recording' || recordingStatus === 'paused') && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 rounded-full px-3 py-1.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              recordingStatus === 'recording'
                ? 'bg-red-500 animate-pulse'
                : 'bg-yellow-400'
            }`}
          />
          <span className="text-white text-xs font-mono tracking-wider">
            {recordingStatus === 'paused' ? '⏸ ' : ''}
            {formatDuration(duration)}
          </span>
        </div>
      )}

      {/* Teleprompter overlay */}
      {script.trim() && (
        <div
          ref={teleprompterRef}
          className="absolute inset-0 overflow-y-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          <style>{`.teleprompter-container::-webkit-scrollbar { display: none; }`}</style>
          <div
            className="teleprompter-container px-6 bg-black/55 text-white text-center whitespace-pre-wrap font-medium leading-relaxed"
            style={{
              paddingTop: containerHeight || '50vh',
              paddingBottom: containerHeight || '50vh',
              fontSize: `${fontSize}px`,
            }}
          >
            {script}
          </div>
        </div>
      )}
    </div>
  )
}
