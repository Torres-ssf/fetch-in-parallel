import { fetch } from '../fetch/fetch'
import { IFetchInParallelParams, IFetchInParallelReturns } from '../fetchInParallel'



export interface IFetchParallelWithPromiseAllParams extends IFetchInParallelParams {}

export interface IFetchParallelWithPromiseAllReturns extends IFetchInParallelReturns {}



export const fetchParallelWithPromiseAll = async (
  params: IFetchParallelWithPromiseAllParams
): Promise<IFetchParallelWithPromiseAllReturns> => {
  const {
    urls,
    concorrent,
    timeout
  } = params

  let totalFetched = 0
  let isFetchingInProcess = false
  const resolvedUrls: IFetchInParallelReturns = {}

  return new Promise(resolve => {
    const interval = setInterval(async () => {
      if (totalFetched === urls.length) {
        clearInterval(interval)
        resolve(resolvedUrls)
        return
      }

      if (isFetchingInProcess) {
        return
      }

      isFetchingInProcess = true

      const urlsToFetch = urls.slice(totalFetched, totalFetched + concorrent)

      const promises = urlsToFetch.map(async (url) => {
        try {
          const fetchResponse = await fetch({
            url,
            timeout
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
      })

      await Promise.all(promises)

      totalFetched += urlsToFetch.length

      isFetchingInProcess = false
    }, 100)
  })
}
