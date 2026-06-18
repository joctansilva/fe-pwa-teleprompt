'use client'
import type { RecordingStatus } from '@/hooks/useRecording'

interface Props {
  status: RecordingStatus
  duration: number
  isSupported: boolean
  error: string | null
  hasStream: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0)
    return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function RecordingControls({
  status,
  duration,
  isSupported,
  error,
  hasStream,
  onStart,
  onPause,
  onResume,
  onStop,
}: Props) {
  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg m-3 text-yellow-300 text-sm">
        Seu navegador não suporta gravação de vídeo. Use Chrome, Edge ou Firefox.
      </div>
    )
  }

  return (
    <div className="p-3 bg-gray-900 border-t border-gray-800">
      {error && (
        <p className="text-red-400 text-xs mb-2 text-center">{error}</p>
      )}

      <div className="flex items-center gap-2">
        {/* Status label */}
        <div className="flex items-center gap-1.5 min-w-[90px]">
          {status === 'recording' && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          {status === 'paused' && (
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
          )}
          <span className="text-xs font-mono text-gray-300">
            {status === 'idle' && '—'}
            {status === 'recording' && formatDuration(duration)}
            {status === 'paused' && formatDuration(duration)}
            {status === 'stopped' && formatDuration(duration)}
          </span>
        </div>

        <div className="flex gap-2 flex-1 justify-end">
          {status === 'idle' && (
            <button
              onClick={onStart}
              disabled={!hasStream}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              <span className="w-3 h-3 rounded-full bg-white" />
              Gravar
            </button>
          )}

          {status === 'recording' && (
            <>
              <button
                onClick={onPause}
                className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors"
              >
                ⏸ Pausar
              </button>
              <button
                onClick={onStop}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                ⏹ Encerrar
              </button>
            </>
          )}

          {status === 'paused' && (
            <>
              <button
                onClick={onResume}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
              >
                ▶ Continuar
              </button>
              <button
                onClick={onStop}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                ⏹ Encerrar
              </button>
            </>
          )}

          {status === 'stopped' && (
            <button
              onClick={onStart}
              disabled={!hasStream}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-lg font-medium transition-colors"
            >
              <span className="w-3 h-3 rounded-full bg-white" />
              Nova gravação
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
