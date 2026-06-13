import { NextResponse } from 'next/server'

const GH = 'https://api.github.com'

function getToken(): string {
  let raw: string | undefined = process.env.GITHUB_TOKEN ?? process.env['\uFEFFGITHUB_TOKEN']
  if (!raw) {
    const key = Object.keys(process.env).find((k) => k.endsWith('GITHUB_TOKEN'))
    raw = key ? (process.env[key] as string) : undefined
  }
  return typeof raw === 'string' ? raw.trim() : ''
}

function makeHeaders(): HeadersInit {
  const token = getToken()
  const base: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  return token ? { ...base, Authorization: `Bearer ${token}` } : base
}

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = (searchParams.get('username') || '1mRen').trim()
    const repoLimit = Math.min(Math.max(parseInt(searchParams.get('repoLimit') || '30', 10), 1), 100)

    const reposRes = await fetch(
      `${GH}/users/${username}/repos?per_page=100&sort=pushed&direction=desc`,
      { headers: makeHeaders(), cache: 'no-store' }
    )

    if (!reposRes.ok) {
      const text = await reposRes.text()
      throw new Error(`Repos fetch failed (${reposRes.status}): ${text}`)
    }

    const repos = await reposRes.json() as Array<{
      name: string
      full_name: string
      fork: boolean
      archived: boolean
      private: boolean
    }>

    const eligible = repos
      .filter((r) => !r.fork && !r.archived && !r.private)
      .slice(0, repoLimit)

    const langResults = await Promise.allSettled(
      eligible.map(async (repo) => {
        const [owner, repoName] = repo.full_name.split('/')
        const res = await fetch(
          `${GH}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/languages`,
          { headers: makeHeaders(), cache: 'no-store' }
        )
        if (!res.ok) return {} as Record<string, number>
        return res.json() as Promise<Record<string, number>>
      })
    )

    const totals: Record<string, number> = {}
    for (const result of langResults) {
      if (result.status === 'fulfilled') {
        for (const [lang, bytes] of Object.entries(result.value)) {
          totals[lang] = (totals[lang] || 0) + (bytes as number)
        }
      }
    }

    const totalBytes = Object.values(totals).reduce((a, b) => a + b, 0)
    const languages = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percent: totalBytes ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
      }))

    return NextResponse.json({
      username,
      repoCount: eligible.length,
      totalBytes,
      languages,
      source: 'GitHub language statistics (public repos)',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
