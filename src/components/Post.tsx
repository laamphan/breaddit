'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { useToast } from '@/hooks/use-toast'
import { formatTimeToNow } from '@/lib/utils'
import { SubscribeToSubredditRequest } from '@/lib/validators/subreddit'
import { Post, User, Vote } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { EditorOutput } from './EditorOutput'
import { PostVoteClient } from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  subredditName: string
  subredditId?: string
  currentVote?: PartialVote
  commentAmt: number
  passedRef?: any
  userId?: string
  subscribed?: boolean
}

export const Posts = ({
  subredditName,
  subredditId = '',
  post,
  commentAmt,
  votesAmt,
  currentVote,
  passedRef,
  userId,
  subscribed,
}: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null)

  const { toast } = useToast()
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: subscribe, isPending: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditRequest = {
        subredditId,
      }

      await axios.post('/api/subreddit/subscribe', payload)
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      // startTransition(() => {
      router.refresh()
      // })

      return toast({
        title: 'Subscribed',
        description: `You are now subscribed to r/${subredditName}`,
      })
    },
  })

  return (
    <div className='rounded-md bg-white shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />

        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            {subredditName ? (
              <>
                <a
                  className='underline text-zinc-900 text-sm underline-offset-2'
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>

                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))} {/* {userId ? ( */}
            {subscribed === false ? (
              <>
                <span className='px-1'>•</span>
                <span className=''>
                  <a
                    className='text-white bg-blue-700 px-2 py-1 rounded-md font-semibold text-sm cursor-pointer corner'
                    onClick={() => subscribe()}
                  >
                    Join
                  </a>
                </span>
              </>
            ) : null}
            {/* ) : null}{' '} */}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1
              className='text-lg font-semibold py-2 leading-6 text-gray-900'
              ref={passedRef}
            >
              {post.title}
            </h1>
          </a>
          <div
            className='relative text-sm max-h-[450px] w-full overflow-clip'
            ref={pRef}
          >
            <EditorOutput content={post.content} />

            {/* apply gradient if post height above value */}
            {pRef.current?.clientHeight === 450 ? (
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
            ) : null}
          </div>
        </div>
      </div>
      <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'>
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className='w-fit flex items-center gap-2'
        >
          <MessageSquare className='h-4 w-4' />
          {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}
