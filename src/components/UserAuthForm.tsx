'use client'

import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Icons } from './Icons'

/**
 *  make possible to pass all HTML attributes a "div" can receive
 *  => "id", "className", "style", ...
 *  or event handlers "onClick", "onChange"
 *  or custom props
 */
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  // custom props here
}

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // next-auth
      await signIn('google')
    } catch (error) {
      toast({
        title: 'There was a problem',
        description: 'There was an error logging in with Google.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        isLoading={isLoading}
        type='button'
        size='sm'
        className='w-full'
        onClick={loginWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />}
        Google
      </Button>
    </div>
  )
}
