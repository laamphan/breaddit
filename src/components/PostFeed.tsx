'use client'

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Posts as Post } from './Post'

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
  subscribedSubreddits?: string[]
  userId?: string
}

export const PostFeed = ({
  initialPosts,
  subredditName,
  subscribedSubreddits,
  userId,
}: PostFeedProps) => {
  // later assign this ref to (last) post element
  const lastPostRef = useRef<HTMLElement>(null)

  /**
   * mantine hooks
   * useIntersection : to detect when element enters/leave viewport
   * => lazy loading images || trigger animations || load data when scroll
   *
   * if an element with ref={ref} reaches the end of viewport
   * => trigger "fetchNextPage()" from "useInfiniteQuery"
   * by checking "entry?.isIntersecting"
   */
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    ExtendedPost[],
    Error
  >({
    queryKey: ['infinite-query'],
    queryFn: async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '')
      const response = await axios.get(query)
      return response.data
    },
    // ({ pageParam = 1 }) => {
    //   const query =
    //     `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
    //     (!!subredditName ? `&subredditName=${subredditName}` : '')

    //   const { data } = await axios.get(query)
    //   return data as ExtendedPost[]
    // },

    getNextPageParam: (_, pages) => {
      return pages.length + 1
    },
    initialData: { pages: [initialPosts], pageParams: [1] },
    initialPageParam: 1,
  })

  const [posts, setPosts] = useState<ExtendedPost[]>(initialPosts)
  const [postsCount, setPostsCount] = useState(0)
  const [firstPageFetched, setFirstPageFetched] = useState(false)
  const [refetchCount, setRefetchCount] = useState(0)

  useEffect(() => {
    setRefetchCount(0)
    setPostsCount(posts.length)
  }, [posts.length])

  useEffect(() => {
    if (firstPageFetched === false) {
      fetchNextPage()
      setFirstPageFetched(true)
    }
    if (entry?.isIntersecting) {
      if (refetchCount === 6) {
      } else {
        fetchNextPage()
        if (data) {
          const posts = data.pages.flatMap((pages) => pages)
          if (posts.length > 0 && posts.length > initialPosts.length) {
            setPosts(posts)
          }
        }
        if (posts.length === postsCount) {
          setRefetchCount(refetchCount + 1)
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, fetchNextPage, isFetchingNextPage])

  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const currentVote = post.votes.find((vote) => vote.userId === userId)

        if (index === posts.length - 1) {
          // assign ref to (last) post element
          return (
            <li
              key={post.id}
              // ref={ref}
            >
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                subredditId={post.subreddit.id}
                votesAmt={votesAmt}
                currentVote={currentVote}
                passedRef={ref}
                // userId={session?.user.id}
                subscribed={
                  subscribedSubreddits
                    ? subscribedSubreddits.indexOf(post.subreddit.id) > -1
                    : undefined
                }
              />
            </li>
          )
        } else {
          return (
            <li key={post.id}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                subredditId={post.subreddit.id}
                votesAmt={votesAmt}
                currentVote={currentVote}
                userId={userId}
                subscribed={
                  subscribedSubreddits
                    ? subscribedSubreddits.indexOf(post.subreddit.id) > -1
                    : undefined
                }
              />
            </li>
          )
        }
      })}

      {isFetchingNextPage && (
        <li className='flex justify-center'>
          <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
        </li>
      )}
    </ul>
  )
}
