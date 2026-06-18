'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped'

const MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
]

function getSupportedMimeType() {
  if (typeof MediaRecorder === 'undefined') return ''
  return MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) ?? ''
}

export function useRecording(stream: MediaStream | null) {
  // Start false on both server and client to avoid hydration mismatch;
  // updated after mount when the real API availability is known.
  const [isSupported, setIsSupported] = useState(false)
  const [status, setStatus] = useState<RecordingStatus>('idle')
  const [duration, setDuration] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)
  const elapsedRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setDuration(elapsedRef.current + Date.now() - startTimeRef.current)
    }, 100)
  }, [])

  const pauseTimer = useCallback(() => {
    elapsedRef.current += Date.now() - startTimeRef.current
    clearTimer()
  }, [clearTimer])

  const startRecording = useCallback(() => {
    if (!stream) {
      setError('Câmera não está ativa.')
      return
    }
    if (!isSupported) {
      setError('Seu navegador não suporta gravação de vídeo (MediaRecorder).')
      return
    }

    chunksRef.current = []
    elapsedRef.current = 0
    const mimeType = getSupportedMimeType()

    try {
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || 'video/webm',
        })
        const url = URL.createObjectURL(blob)
        setRecordedBlob(blob)
        setRecordedUrl(url)
        setStatus('stopped')
      }

      recorder.start(1000)
      recorderRef.current = recorder
      setStatus('recording')
      setError(null)
      setRecordedBlob(null)
      setRecordedUrl(null)
      setDuration(0)
      startTimer()
    } catch {
      setError('Erro ao iniciar gravação.')
    }
  }, [stream, isSupported, startTimer])

  const pauseRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.pause()
      setStatus('paused')
      pauseTimer()
    }
  }, [pauseTimer])

  const resumeRecording = useCallback(() => {
    if (recorderRef.current?.state === 'paused') {
      recorderRef.current.resume()
      setStatus('recording')
      startTimer()
    }
  }, [startTimer])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
      clearTimer()
    }
  }, [clearTimer])

  const downloadVideo = useCallback(() => {
    if (!recordedUrl || !recordedBlob) return
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const name = `teleprompter_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}.webm`
    const a = document.createElement('a')
    a.href = recordedUrl
    a.download = name
    a.click()
  }, [recordedUrl, recordedBlob])

  const clearRecording = useCallback(() => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl)
    setRecordedUrl(null)
    setRecordedBlob(null)
    setStatus('idle')
    setDuration(0)
    elapsedRef.current = 0
  }, [recordedUrl])

  useEffect(() => {
    setIsSupported(typeof MediaRecorder !== 'undefined')
  }, [])

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return {
    isSupported,
    status,
    duration,
    recordedUrl,
    recordedBlob,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadVideo,
    clearRecording,
  }
}
