import { CommentsSection } from '@/components/CommentsSection'
import { EditorOutput } from '@/components/EditorOutput'
import { PostVoteServer } from '@/components/post-vote/PostVoteServer'
import { PostMenu } from '@/components/PostMenu'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  params: {
    slug: string
    postId: string
  }
}

/**
 * * next's route segment config
 * "const dynamic" : change dynamic behavior to fully static | fully dynamic
 * "force-dynamic" : rendered for each user at request time
 */
export const dynamic = 'force-dynamic'
// caching doesn't seem to work well. uncommented:
export const fetchCache = 'force-no-store'
/**
 * * commented the line below : line above did all the job
 * ! export const fetchCache = 'force-no-store'
 * ? "const dynamic" rendering? redis somehow does not work well with default
 * ? probably does not work well with next's caching behind default render behavior
 */
const page = async ({ params }: PageProps) => {
  const session = await getAuthSession()

  // redis : load cached post
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <div>
      <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              })
            }}
          />
        </Suspense>

        <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
                Posted by u/{post?.author.username ?? cachedPost.authorUsername}
                {'•'}
                {formatTimeToNow(
                  new Date(post?.createdAt ?? cachedPost.createdAt)
                )}
              </p>
              <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
                {post?.title ?? cachedPost.title}
              </h1>
            </div>
            {session?.user && (
              <PostMenu
                postId={post!.id}
                authorId={post!.authorId}
                subredditName={params.slug}
                user={session.user}
              />
            )}
          </div>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Loader2 className='h-5 w-5 animate-spin text-zinc-500' />
            }
          >
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className='flex items-center flex-col pr-6 w-20'>
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>

      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}

export default page
