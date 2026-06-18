'use client'

interface Props {
  url: string
  onDownload: () => void
  onClear: () => void
}

export default function VideoPreview({ url, onDownload, onClear }: Props) {
  return (
    <div className="bg-gray-900 border-t border-gray-800 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Gravação finalizada</h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded"
        >
          Fechar
        </button>
      </div>

      <video
        src={url}
        controls
        className="w-full rounded-lg bg-black max-h-48 lg:max-h-40"
      />

      <button
        onClick={onDownload}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Baixar vídeo (.webm)
      </button>
    </div>
  )
}
