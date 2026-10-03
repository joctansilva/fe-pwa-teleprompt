'use client'
import { useState, useCallback, useEffect } from 'react'

type FacingMode = 'user' | 'environment'

interface CameraState {
  stream: MediaStream | null
  error: string | null
  isLoading: boolean
  isMirrored: boolean
  facingMode: FacingMode
}

export function useCamera() {
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    isLoading: false,
    isMirrored: true,
    facingMode: 'user',
  })

  const startCamera = useCallback(async (facing: FacingMode = 'user') => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    if (!navigator?.mediaDevices?.getUserMedia) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Seu navegador não suporta acesso à câmera.',
      }))
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        // Defaults (audio: true) apply voice-call processing — echo cancellation,
        // noise suppression and auto gain — which makes speech sound muffled and
        // "pumping". Disable it to get the raw mic, like the native camera app.
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: { ideal: 2 },
          sampleRate: { ideal: 48000 },
        },
      })
      setState((prev) => ({
        ...prev,
        stream,
        isLoading: false,
        facingMode: facing,
        error: null,
      }))
    } catch (err) {
      let message = 'Erro ao acessar câmera ou microfone.'
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError')
          message = 'Permissão de câmera/microfone negada. Verifique as configurações do navegador.'
        else if (err.name === 'NotFoundError')
          message = 'Câmera não encontrada neste dispositivo.'
        else if (err.name === 'NotReadableError')
          message = 'Câmera em uso por outro aplicativo.'
        else if (err.name === 'OverconstrainedError')
          message = 'Configuração de câmera não suportada pelo dispositivo.'
      }
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [])

  const stopCamera = useCallback(() => {
    setState((prev) => {
      prev.stream?.getTracks().forEach((t) => t.stop())
      return { ...prev, stream: null }
    })
  }, [])

  const switchCamera = useCallback(async () => {
    setState((prev) => {
      prev.stream?.getTracks().forEach((t) => t.stop())
      return { ...prev, stream: null }
    })
    await startCamera(state.facingMode === 'user' ? 'environment' : 'user')
  }, [state.facingMode, startCamera])

  const toggleMirror = useCallback(() => {
    setState((prev) => ({ ...prev, isMirrored: !prev.isMirrored }))
  }, [])

  useEffect(() => {
    return () => {
      setState((prev) => {
        prev.stream?.getTracks().forEach((t) => t.stop())
        return prev
      })
    }
  }, [])

  return { ...state, startCamera, stopCamera, switchCamera, toggleMirror }
}
