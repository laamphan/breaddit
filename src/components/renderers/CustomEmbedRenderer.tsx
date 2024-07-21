'use client'

export default function CustomEmbedRenderer({ data }: any) {
  return (
    <div className='relative w-full min-h-[440px]'>
      <figure
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px 0',
          width: '100%',
          maxWidth: '100%',
          height: '400px',
          maxHeight: '400px',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={data.embed}
          style={{
            maxWidth: '100%',
            width: '580px',
            height: '320px',
            maxHeight: '400px',
            borderRadius: '5px',
            boxShadow: 'none',
            outline: 'none',
            border: 'none',
          }}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </figure>
    </div>
  )
}
