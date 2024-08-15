import { getAuthSession } from '@/lib/auth'
import axios from 'axios'

export const GET = async (req: Request) => {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    if (!code) {
      return new Response('Missing code parameter', { status: 400 })
    }

    const params = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
    })

    const response = await axios.post(
      `https://open-api.tiktok.com/oauth/access_token/?${params.toString()}`,
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (response.data.error) {
      console.log('TikTok API error:', response.data)
      return new Response(
        `Error from TikTok: ${response.data.error_description}`,
        { status: 400 }
      )
    }

    console.log('TikTok response', response.data)
    return new Response('Success', { status: 200 })

    // Handle the response and save the access token
  } catch (error) {
    console.log('Error signing in with TikTok:', error)
    return new Response('Error signing in with TikTok', {
      status: 500,
    })
  }
}
