import { onUpdate } from './on-update'
import useCodeMirror from './use-code-mirror'
import { useEffect } from 'react'
import { ViewUpdate } from '@codemirror/view'
import { Extension } from '@codemirror/state'

export function useCodeEditor({
  value,
  onChange,
  extensions,
}: {
  value: string
  onChange: (value: string, viewUpdate: ViewUpdate) => void
  extensions: Extension[]
}) {
  const { ref, view } = useCodeMirror([onUpdate(onChange), ...extensions])

  useEffect(() => {
    if (view) {
      const editorValue = view.state.doc.toString()
      if (value !== editorValue) {
        view.dispatch({
          changes: {
            from: 0,
            to: editorValue.length,
            insert: value || '',
          },
        })
      }
    }
  }, [value, view])

  return ref
}
