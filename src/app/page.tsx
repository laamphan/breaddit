import { CustomFeed } from '@/components/homepage/CustomFeed'
import { GeneralFeed } from '@/components/homepage/GeneralFeed'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
  const session = await getAuthSession()

  if (session?.user) {
    const subscriptions = await db.subscription.findMany()
    const subscribers = subscriptions.map((e) => e.userId)
    if (subscribers.indexOf(session.user.id) === -1) {
      redirect('/r/all')
    }
  }

  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl'>Your Feed</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {/* feed */}
        {/* @ts-expect-error Server Component */}
        {session ? <CustomFeed /> : <GeneralFeed />}
        {/* subreddit info */}
        <div className='overflow-hidden h-fit order-first md:order-last sticky top-[-14.7rem] md:top-[-15rem] lg:top-[-12.85rem]'>
          <div className='rounded-lg border border-gray-200 '>
            <div className='rounded-t-lg bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <HomeIcon className='w-4 h-4'></HomeIcon>Home
              </p>
            </div>
            <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  Your personal Breaddit homepage. Come here to check in with
                  your favorite communities.
                </p>
              </div>
              <Link
                className={buttonVariants({ className: 'w-full mt-4 mb-6' })}
                href='/r/create'
              >
                Create community
              </Link>
            </dl>
          </div>
          {session ? (
            <div className='rounded-lg border border-gray-200 px-6 py-4 mt-4 hidden md:block'>
              <p className='font-semibold py-1 flex items-center gap-1.5'>
                Quick access
              </p>
              <Link href='/r/all'>
                <p className='py-1'>/r/all</p>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
