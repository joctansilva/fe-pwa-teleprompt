'use client'

interface Props {
  script: string
  onChange: (v: string) => void
  onClear: () => void
}

export default function ScriptEditor({ script, onChange, onClear }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Roteiro
        </h2>
        <button
          onClick={onClear}
          disabled={!script}
          className="text-xs text-gray-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded"
        >
          Limpar
        </button>
      </div>

      <textarea
        value={script}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole ou escreva seu roteiro aqui…&#10;&#10;O texto vai aparecer sobreposto à câmera como teleprompter."
        className="flex-1 min-h-[240px] lg:min-h-[300px] resize-none bg-gray-800 text-white placeholder-gray-600 rounded-lg p-3 text-sm leading-relaxed border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
      />

      <p className="text-xs text-gray-600 text-right">
        {script.length > 0
          ? `${script.length} caracteres · salvo automaticamente`
          : 'Salvo automaticamente no navegador'}
      </p>
    </div>
  )
}
