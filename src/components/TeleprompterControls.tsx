'use client'

interface Props {
  isScrolling: boolean
  speed: number
  fontSize: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSpeedChange: (v: number) => void
  onFontSizeChange: (v: number) => void
}

export default function TeleprompterControls({
  isScrolling,
  speed,
  fontSize,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
  onFontSizeChange,
}: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Teleprompter
      </h2>

      {/* Scroll controls */}
      <div className="flex gap-2">
        {isScrolling ? (
          <button
            onClick={onPause}
            className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors"
          >
            ⏸ Pausar
          </button>
        ) : (
          <button
            onClick={onStart}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
          >
            ▶ Rolar
          </button>
        )}
        <button
          onClick={onReset}
          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          title="Reiniciar"
        >
          ↺
        </button>
      </div>

      {/* Speed */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm text-gray-300">
          <label htmlFor="speed">Velocidade</label>
          <span className="font-mono text-gray-400">{speed} px/s</span>
        </div>
        <input
          id="speed"
          type="range"
          min={10}
          max={300}
          step={5}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Lento</span>
          <span>Rápido</span>
        </div>
      </div>

      {/* Font size */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm text-gray-300">
          <label htmlFor="fontsize">Tamanho da fonte</label>
          <span className="font-mono text-gray-400">{fontSize}px</span>
        </div>
        <input
          id="fontsize"
          type="range"
          min={16}
          max={80}
          step={2}
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Menor</span>
          <span>Maior</span>
        </div>
      </div>
    </div>
  )
}
