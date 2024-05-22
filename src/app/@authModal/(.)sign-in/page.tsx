// "app/@authModal" - parallel routes - render in parallel with "app/(auth)"

// "(.)sign-in" - intercepting routes - intercept "(auth)/sign-in/page.tsx"
// on Reload -> loads the intercepted route "(auth)/sign-in/page.tsx"

import { CloseModal } from '@/components/CloseModal'
import { SignIn } from '@/components/SignIn'

const page = () => {
  return (
    <div className='fixed inset-0 bg-zinc-900/20 z-10'>
      <div className='container flex items-center h-full max-w-lg mx-auto'>
        <div className='relative bg-white w-full h-fit py-20 px-2 rounded-lg'>
          <div className='absolute top-4 right-4'>
            <CloseModal />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default page
