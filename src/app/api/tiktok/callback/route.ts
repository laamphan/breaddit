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
    const response = await axios.post(
      'https://open-api.tiktok.com/oauth/access_token/',
      {
        client_key: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI,
      }
    )

    console.log('Tiktok response', response.data)
    return new Response('Success', { status: 200 })

    // Handle the response and save the access token
  } catch (error) {
    return new Response('Error signing in with Tiktok', {
      status: 500,
    })
  }
}
