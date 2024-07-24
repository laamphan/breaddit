import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId } = z.object({ postId: z.string() }).parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // verify user is subscribed to passed subreddit id
    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
    })

    if (post?.authorId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response('Could not delete post, please try again later', {
      status: 500,
    })
  }
}
