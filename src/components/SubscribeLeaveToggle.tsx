'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { useToast } from '@/hooks/use-toast'
import { SubscribeToSubredditRequest } from '@/lib/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { Button } from './ui/Button'

interface SubscribeLeaveToggleProps {
  subredditId: string
  isSubscribed: boolean
  subredditName: string
}

export const SubscribeLeaveToggle = ({
  subredditId,
  isSubscribed,
  subredditName,
}: SubscribeLeaveToggleProps) => {
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
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Subscribed',
        description: `You are now subscribed to r/${subredditName}`,
      })
    },
  })

  const { mutate: unsubscribe, isPending: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditRequest = {
        subredditId,
      }

      await axios.post('/api/subreddit/unsubscribe', payload)
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
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Unsubscribed',
        description: `You are now unsubscribed from r/${subredditName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      className='w-full mt-1 mb-4 whitespace-nowrap'
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className='w-full mt-1 mb-4'
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  )
}
