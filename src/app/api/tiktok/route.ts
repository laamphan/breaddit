import { getAuthSession } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const csrfState = Math.random().toString(36).substring(2)
    const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${
      process.env.TIKTOK_CLIENT_KEY
    }&scope=user.info.basic,video.publish,video.upload&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.TIKTOK_REDIRECT_URI!
    )}&state=${csrfState}`

    const headers = new Headers()
    headers.append(
      'Set-Cookie',
      `csrfState=${csrfState}; Max-Age=60; Path=/; HttpOnly; Secure`
    )
    headers.append('Location', url)

    return new Response(null, {
      status: 302,
      headers: headers,
    })
  } catch (error) {
    return new Response('Error signing in with Tiktok', {
      status: 500,
    })
  }
}
