import { EditorView, ViewUpdate } from '@codemirror/view'

export function onUpdate(
  onChange: (value: string, viewUpdate: ViewUpdate) => void,
) {
  return EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    if (viewUpdate.docChanged) {
      const doc = viewUpdate.state.doc
      const value = doc.toString()
      onChange(value, viewUpdate)
    }
  })
}
