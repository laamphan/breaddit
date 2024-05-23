'use client'

import dynamic from 'next/dynamic'
import CustomCodeRenderer from './renderers/CustomCodeRenderer'
import CustomImageRenderer from './renderers/CustomImageRenderer'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)

interface EditorOutputProps {
  content: any
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

export const EditorOutput = ({ content }: EditorOutputProps) => {
  return (
    // @ts-expect-error
    <Output
      data={content}
      style={style}
      className='text-sm'
      renderers={renderers}
    />
  )
}
