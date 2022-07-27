import { fetch } from './fetch/fetch'



export interface IFetchInParallelParams {
  urls: string[]
  concorrent: number
  timeout?: number
}

export interface IFetchInParallelReturns {
  [url: string]: {
    text: string
    success: boolean
  }
}

export const fetchInParallel = async (
  params: IFetchInParallelParams
): Promise<IFetchInParallelReturns> => {
  const {
    urls,
    concorrent,
    timeout
  } = params

  let totalFetched = 0
  let inGoingFetchings = 0

  const urlsToFetch = [...urls]
  const numOfUrls = urls.length
  const resolvedUrls: IFetchInParallelReturns = {}

  return new Promise<IFetchInParallelReturns>(resolve => {
    const interval = setInterval(async () => {
      if (totalFetched === numOfUrls) {
        clearInterval(interval)
        resolve(resolvedUrls)
        return
      }

      if (inGoingFetchings >= concorrent || !urlsToFetch.length) {
        return
      }

      inGoingFetchings++

      const url = urlsToFetch.pop()!

      try {
        const fetchResponse = await fetch({
          url,
          ...(timeout && { timeout })
        })

        const text = await fetchResponse.text()

        resolvedUrls[url] = {
          text,
          success: true
        }
      } catch (err) {
        resolvedUrls[url] = {
          text: err.message,
          success: false
        }
      }

      totalFetched++

      inGoingFetchings--
    }, 100)
  })
}
