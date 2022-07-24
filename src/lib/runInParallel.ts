import fetch from 'node-fetch'

export const runInParallel = async (urls: string[], concorrent: number) => {
  let totalFetched = 0
  const urlsToFetch = urls.length
  let inGoingFetchings = 0
  const resolvedUrls: string[] = []

  return new Promise(resolve => {
    const interval = setInterval(async () => {
      if (totalFetched === urlsToFetch) {
        clearInterval(interval)
        resolve(resolvedUrls)
        return
      }

      if (inGoingFetchings >= concorrent || !urls.length) {
        return
      }

      inGoingFetchings++

      const url = urls.pop()!

      try {
        const fetchResponse = await fetch(url)

        const result = await fetchResponse.text()

        resolvedUrls.push(result)
      } catch (err) {
        console.error('error resolving url ', url)

        console.error(err.message)
      }

      totalFetched++

      inGoingFetchings--
    }, 100)
  })
}
