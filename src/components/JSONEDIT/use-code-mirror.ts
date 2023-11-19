// use-code-mirror.ts
import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'
import { Extension } from '@codemirror/state'

export default function useCodeMirror(extensions: Extension[]) {
  const ref = useRef<HTMLElement>()
  const [view, setView] = useState<EditorView>()

  useEffect(() => {
    const view = new EditorView({
      extensions: [
        basicSetup,
        /**
         * Check each language package to see what they support,
         * for instance javascript can use typescript and jsx.
         */
        json(),
        ...extensions,
      ],
      parent: ref.current,
    })

    setView(view)

    /**
     * Make sure to destroy the codemirror instance
     * when our components are unmounted.
     */
    return () => {
      view.destroy()
      setView(undefined)
    }
  }, [])

  return { ref, view }
}
