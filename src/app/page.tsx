'use client'
import { useEffect } from 'react'
import { useCamera } from '@/hooks/useCamera'
import { useRecording } from '@/hooks/useRecording'
import { useTeleprompter } from '@/hooks/useTeleprompter'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import CameraSection from '@/components/CameraSection'
import RecordingControls from '@/components/RecordingControls'
import TeleprompterControls from '@/components/TeleprompterControls'
import ScriptEditor from '@/components/ScriptEditor'
import VideoPreview from '@/components/VideoPreview'

export default function Home() {
  const camera = useCamera()
  const teleprompter = useTeleprompter()
  const recording = useRecording(camera.stream)
  const [script, setScript] = useLocalStorage('teleprompt-script', '')

  useEffect(() => {
    camera.startCamera()
    return () => camera.stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSwitchCamera = async () => {
    if (recording.status === 'recording' || recording.status === 'paused') return
    await camera.switchCamera()
  }

  return (
    <main className="min-h-screen bg-gray-950 lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:h-full">

        {/* ── Left column: camera + controls ── */}
        <div className="flex flex-col lg:h-full lg:overflow-hidden">

          {/* Camera + teleprompter overlay */}
          <CameraSection
            stream={camera.stream}
            isMirrored={camera.isMirrored}
            error={camera.error}
            isLoading={camera.isLoading}
            script={script}
            fontSize={teleprompter.fontSize}
            containerHeight={teleprompter.containerHeight}
            teleprompterRef={teleprompter.containerRef}
            recordingStatus={recording.status}
            duration={recording.duration}
            onRetry={() => camera.startCamera()}
          />

          {/* Camera toggles */}
          <div className="flex gap-2 p-3 bg-gray-900 border-t border-gray-800">
            <button
              onClick={handleSwitchCamera}
              disabled={!camera.stream}
              className="flex-1 py-2.5 px-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              title="Alternar câmera frontal/traseira"
            >
              ⇄ Câmera
            </button>
            <button
              onClick={camera.toggleMirror}
              disabled={!camera.stream}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                camera.isMirrored
                  ? 'bg-blue-700 hover:bg-blue-600'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {camera.isMirrored ? '↔ Espelhado' : '↔ Espelhar'}
            </button>
          </div>

          {/* Recording controls */}
          <RecordingControls
            status={recording.status}
            duration={recording.duration}
            isSupported={recording.isSupported}
            error={recording.error}
            hasStream={!!camera.stream}
            onStart={recording.startRecording}
            onPause={recording.pauseRecording}
            onResume={recording.resumeRecording}
            onStop={recording.stopRecording}
          />

          {/* Video preview after stop */}
          {recording.recordedUrl && (
            <VideoPreview
              url={recording.recordedUrl}
              onDownload={recording.downloadVideo}
              onClear={recording.clearRecording}
            />
          )}
        </div>

        {/* ── Right column: editor + teleprompter settings ── */}
        <div className="flex flex-col gap-4 p-4 lg:h-full lg:overflow-y-auto bg-gray-950">
          <TeleprompterControls
            isScrolling={teleprompter.isScrolling}
            speed={teleprompter.speed}
            fontSize={teleprompter.fontSize}
            onStart={teleprompter.start}
            onPause={teleprompter.pause}
            onReset={teleprompter.reset}
            onSpeedChange={teleprompter.setSpeed}
            onFontSizeChange={teleprompter.setFontSize}
          />
          <ScriptEditor
            script={script}
            onChange={setScript}
            onClear={() => setScript('')}
          />
        </div>

      </div>
    </main>
  )
}
