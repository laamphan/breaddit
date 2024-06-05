import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostFeed } from '../PostFeed'

interface GeneralFeedProps {
  subredditName?: string
}

export const GeneralFeed = async ({ subredditName }: GeneralFeedProps) => {
  const session = await getAuthSession()

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },

    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })

  let subscribedSubreddits
  let subscribed

  if (subredditName) {
    subscribedSubreddits = await db.subscription.findMany({
      where: {
        userId: session?.user.id,
      },
    })

    subscribed = subscribedSubreddits.map((e) => {
      return e.subredditId
    })
  }

  return (
    <PostFeed
      initialPosts={posts}
      subredditName={subredditName}
      subscribedSubreddits={subscribed}
    />
  )
}
