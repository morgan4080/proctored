import { useCallback, useEffect, useState } from 'react'
import ErrorPage from 'next/error'
import useSWR from 'swr'
import Navigation from '@/components/Navigation'
import Head from 'next/head'
import classNames from '../../../../utils/ClassNames'
import Container from '@/components/Container'
import Footer from '@/components/Footer'
const Toaster = dynamic(() => import('@/components/ui/toaster'), { ssr: false })
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import clsx from 'clsx'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { cn, fetcher, updateRecord } from '@/lib/utils'
import { Service } from '@/lib/service_types'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'

const Service = ({
  sv,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [service, setService] = useState(sv)
  const url = sv == null ? '' : sv.slug
  const { data: updatedData, mutate } = useSWR(
    '/api/services?slug=' + url,
    fetcher,
    {
      initialData: service,
    } as any,
  )

  useEffect(() => {
    if (updatedData !== undefined) {
      const { data } = updatedData
      if (data.length > 0) setService(data[0])
    }
    return () => {
      setEditing(false)
      setLoading(false)
    }
  }, [updatedData])

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const saveArticle = (htm: string) => {
    setLoading(true)
    if (service !== null) {
      updateRecord(
        {
          _id: service._id,
          title: service.title,
          slug: service.slug,
          excerpt: service.excerpt,
          category: service.category,
          subcategory: service.subcategory,
          description: htm,
          updated: new Date(),
        },
        '/api/services',
      )
        .then(() => mutate())
        .then(() => {
          setLoading(false)
          setEditing(false)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  if ((!router.isFallback && !service?.slug) || service == null) {
    return <ErrorPage statusCode={404} />
  } else {
    return (
      <div className="relative">
        <Head>
          <title>{service.title}</title>
          <meta name="description" content={service.description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={classNames(
            "font-serif",
            'flex min-h-screen flex-col items-center relative',
          )}
        >
          <Container className="xl:px-0" parentClassName="bg-bermuda/95 w-full">
            <section className="bg-cover bg-center w-full">
              <div className="h-full">
                <Navigation />
              </div>
            </section>
          </Container>
          <Container
            className="xl:px-0"
            parentClassName="pt-10 bg-white w-full"
          >
            <div className="w-full prose">
              <h1
                className={cn("font-sans", 'inline-flex relative w-auto')}
              >
                {service.title}
                {session &&
                session.user &&
                (session.user.userRole == 'admin' ||
                  session.user.userRole == 'superuser') ? (
                  editing ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => {
                        setEditing(!editing)
                        const prose = document.querySelector('.ProseMirror')
                        if (prose !== null) {
                          prose.classList.add('border')
                        }
                      }}
                      type="button"
                      className="absolute top-1 -right-16 inline-flex justify-center rounded-full text-xs font-semibold p-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
                    >
                      Edit
                    </button>
                  )
                ) : null}
              </h1>
              <p>{service.excerpt}</p>
            </div>
          </Container>
          <Container
            className="xl:px-0"
            parentClassName="pb-44 pt-10 bg-white w-full"
          >
            <div className="prose prose-slate" style={{ minWidth: '100%' }}>
              <div className={editing ? 'block' : 'hidden'}>
                <EditorProvider
                  slotBefore={
                    <MenuBar
                      form={service}
                      loading={loading}
                      saveArticle={saveArticle}
                    />
                  }
                  extensions={extensions}
                  content={service.description}
                  editable={true}
                >
                  {''}
                </EditorProvider>
              </div>
              {!editing && (
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: service.description,
                  }}
                  style={{ minWidth: '100%' }}
                />
              )}
            </div>
          </Container>
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as any),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Link.configure({
    openOnClick: false,
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

const MenuBar = ({
  form,
  loading,
  saveArticle,
}: {
  form: {
    title: string
    slug: string
    description: string
  }
  loading: boolean
  saveArticle: (htm: string) => void
}) => {
  const { editor } = useCurrentEditor()
  const [colorState, setColorState] = useState('#000000')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== undefined) setColorState(event.target.value)
  }

  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap py-6">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={clsx(editor.isActive('bold') ? 'is-active' : '', 'tip')}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={clsx(editor.isActive('italic') ? 'is-active' : '', 'tip')}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={clsx(editor.isActive('strike') ? 'is-active' : '', 'tip')}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={clsx(editor.isActive('code') ? 'is-active' : '', 'tip')}
      >
        code
      </button>
      <button
        className={'tip'}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        clear marks
      </button>
      <button
        className={'tip'}
        onClick={() => editor.chain().focus().clearNodes().run()}
      >
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={clsx(editor.isActive('paragraph') ? 'is-active' : '', 'tip')}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={clsx(
          editor.isActive('heading', { level: 1 }) ? 'is-active' : '',
          'tip',
        )}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={clsx(
          editor.isActive('heading', { level: 2 }) ? 'is-active' : '',
          'tip',
        )}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={clsx(
          editor.isActive('heading', { level: 3 }) ? 'is-active' : '',
          'tip',
        )}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={clsx(
          editor.isActive('heading', { level: 4 }) ? 'is-active' : '',
          'tip',
        )}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={clsx(
          editor.isActive('heading', { level: 5 }) ? 'is-active' : '',
          'tip',
        )}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={clsx(
          editor.isActive('heading', { level: 6 }) ? 'is-active' : '',
          'tip',
        )}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={clsx(
          editor.isActive('bulletList') ? 'is-active' : '',
          'tip',
        )}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={clsx(
          editor.isActive('orderedList') ? 'is-active' : '',
          'tip',
        )}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={clsx(editor.isActive('codeBlock') ? 'is-active' : '', 'tip')}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={clsx(
          editor.isActive('blockquote') ? 'is-active' : '',
          'tip',
        )}
      >
        blockquote
      </button>
      <button
        className={'tip'}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        horizontal rule
      </button>
      <button
        className={'tip'}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        hard break
      </button>
      <button
        className={'tip'}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </button>
      <button
        className={'tip'}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </button>
      <>
        <input
          type="color"
          className="w-5 h-5 my-auto mx-2"
          value={colorState}
          onChange={handleChange}
        />
        <button
          onClick={() => editor.chain().focus().setColor(colorState).run()}
          className={clsx(
            editor.isActive('textStyle', { color: '#958DF1' })
              ? 'is-active'
              : '',
            'tip',
          )}
        >
          set color
        </button>
      </>
      <button className={'tip'} onClick={addImage}>
        add image
      </button>
      <button
        onClick={setLink}
        className={editor.isActive('link') ? 'is-active tip' : 'tip'}
      >
        setLink
      </button>
      <button
        className={'tip'}
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        unsetLink
      </button>
      <Button
        onClick={() => {
          toast({
            title: 'Service: ' + form.title,
            description: 'Would you like to update this content?',
            action: (
              <ToastAction
                onClick={() => {
                  saveArticle(editor.getHTML())
                }}
                altText="Goto schedule to undo"
              >
                Save
              </ToastAction>
            ),
          })
        }}
        disabled={loading}
        type="button"
        className="inline-flex justify-center rounded-lg text-xs font-semibold p-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
        Save Service
      </Button>
    </div>
  )
}

export const getServerSideProps = (async (context) => {
  const url = context.params
    ? '/api/services?slug=' + context.params.serviceslug
    : '/api/services'
  const { data } = await fetcher(process.env.NEXTAUTH_URL + url)
  const services: Service[] = data
  return {
    props: { sv: services.length > 0 ? services[0] : null, revalidate: 60 },
  }
}) satisfies GetServerSideProps<{
  sv: Service | null
}>

export default Service
