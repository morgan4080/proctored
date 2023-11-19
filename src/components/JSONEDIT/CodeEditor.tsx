import { useCodeEditor } from './use-code-editor'
import { ViewUpdate } from '@codemirror/view'
import { Extension } from '@codemirror/state'

export default function CodeEditor({
  value,
  onChange,
  extensions,
}: {
  value: string
  onChange: (value: string, viewUpdate: ViewUpdate) => void
  extensions: Extension[]
}) {
  const ref = useCodeEditor({ value, onChange, extensions })

  return <div ref={ref as any} />
}
