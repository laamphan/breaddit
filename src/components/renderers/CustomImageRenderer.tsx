'use client'

import Image from 'next/image'

export default function CustomImageRenderer({ data }: any) {
  const src = data.file.url

  return (
    <div className='relative w-full min-h-[450px]'>
      <Image
        alt='image'
        className='object-contain'
        fill
        src={src}
        sizes='auto'
      />
    </div>
  )
}
