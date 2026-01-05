import { React, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { CButton, CButtonGroup, CCard, CCardBody, CFormLabel } from '@coreui/react'
import './TipTapEditor.scss'

const TipTapEditor = ({ content, onChange, label, placeholder = 'Start writing...', error }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'tiptap-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'tiptap-ordered-list',
        },
      }),
      Bold,
      Italic,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        placeholder: placeholder,
      },
    },
  })
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])
  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="tiptap-editor-wrapper">
      {label && <CFormLabel className="fw-bold">{label}</CFormLabel>}

      <CCard className="tiptap-editor-container">
        {/* Toolbar */}
        <div className="tiptap-toolbar p-2 border-bottom">
          <CButtonGroup className="me-2 mb-2">
            <CButton
              size="sm"
              color={editor.isActive('bold') ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              <strong>B</strong>
            </CButton>
            <CButton
              size="sm"
              color={editor.isActive('italic') ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <em>I</em>
            </CButton>
            <CButton
              size="sm"
              color={editor.isActive('underline') ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
            >
              <u>U</u>
            </CButton>
          </CButtonGroup>

          <CButtonGroup className="me-2 mb-2">
            <CButton
              size="sm"
              color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </CButton>
            <CButton
              size="sm"
              color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </CButton>
            <CButton
              size="sm"
              color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </CButton>
          </CButtonGroup>

          <CButtonGroup className="me-2 mb-2">
            <CButton
              size="sm"
              color={editor.isActive('bulletList') ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </CButton>
            <CButton
              size="sm"
              color={editor.isActive('orderedList') ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1. List
            </CButton>
          </CButtonGroup>

          <CButtonGroup className="me-2 mb-2">
            <CButton
              size="sm"
              color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              ←
            </CButton>
            <CButton
              size="sm"
              color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              ↔
            </CButton>
            <CButton
              size="sm"
              color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'secondary'}
              variant="outline"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              →
            </CButton>
          </CButtonGroup>

          <CButtonGroup className="me-2 mb-2">
            <CButton size="sm" color="secondary" variant="outline" onClick={addLink}>
              🔗 Link
            </CButton>
            {editor.isActive('link') && (
              <CButton size="sm" color="danger" variant="outline" onClick={removeLink}>
                Unlink
              </CButton>
            )}
          </CButtonGroup>

          <CButtonGroup className="mb-2">
            <input
              type="color"
              onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="btn btn-sm"
              title="Text Color"
            />
          </CButtonGroup>
        </div>

        {/* Editor Content */}
        <CCardBody className="p-3">
          <EditorContent editor={editor} />
        </CCardBody>
      </CCard>

      {error && <div className="text-danger mt-1 small">{error}</div>}
    </div>
  )
}

export default TipTapEditor
