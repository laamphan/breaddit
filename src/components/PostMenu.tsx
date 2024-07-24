'use client'

import { buttonVariants } from '@/components/ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { PostDeletionRequest } from '@/lib/validators/post'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { User } from 'next-auth'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu'

interface PostMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  subredditName: string
  postId: string
  authorId: string
  user: User
}

export const PostMenu = ({
  subredditName,
  postId,
  authorId,
  user,
}: PostMenuProps) => {
  const { loginToast } = useCustomToast()

  const router = useRouter()

  const { mutate: deletePost } = useMutation({
    mutationFn: async ({ postId }: PostDeletionRequest) => {
      const payload: PostDeletionRequest = { postId }

      await axios.patch(`/api/subreddit/post/update`, payload)
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your post was not deleted. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.push(`/r/${subredditName}`)

      toast({
        title: 'Post deleted',
        description: 'Your post was successfully deleted.',
        variant: 'default',
      })
    },
  })

  return (
    user.id === authorId && (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <div
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'px-2 pb-4 h-5 self-start'
            )}
          >
            ...
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-white' align='end'>
          <DropdownMenuItem
            onSelect={() => {
              deletePost({ postId })
            }}
            className='cursor-pointer'
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  )
}
