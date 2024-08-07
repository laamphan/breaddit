import { getAuthSession } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const url = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${
      process.env.TIKTOK_CLIENT_KEY
    }&scope=user.info.basic&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.TIKTOK_REDIRECT_URI!
    )}`

    console.log('Redirecting to Tiktok', url)

    return Response.redirect(url, 302)
  } catch (error) {
    return new Response('Error signing in with Tiktok', {
      status: 500,
    })
  }
}
