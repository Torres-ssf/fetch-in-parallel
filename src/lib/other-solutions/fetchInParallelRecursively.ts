import { fetch } from '../fetch/fetch'
import { IFetchInParallelParams, IFetchInParallelReturns } from '../fetchInParallel'



export interface IFetchInParallelRecursivelyParams extends IFetchInParallelParams {}

export interface IFetchInParallelRecursivelyReturns extends IFetchInParallelReturns {}



export const fetchInParallelRecursively = async (
  params: IFetchInParallelRecursivelyParams
): Promise<IFetchInParallelRecursivelyReturns> => {
  const {
    urls,
    concorrent,
    timeout
  } = params

  return new Promise(resolve => {
    const fetchParallel = async (
      result: IFetchInParallelReturns,
      concorrent: number,
      position: number,
      concorrentUrls: string[]
    ): Promise<IFetchInParallelReturns> => {
      if (position >= urls.length) {
        return result
      }

      const promises = concorrentUrls.map(async (url) => {
        const fetchResponse = await fetch({
          url,
          timeout
        })

        const text = await fetchResponse.text()

        result[url] = {
          text,
          success: true
        }

        return result
      })

      const resolvedArr = await Promise.all(promises)

      return fetchParallel(
        result,
        concorrent,
        position + resolvedArr.length,
        urls.slice(position, concorrent + position)
      )
    }

    fetchParallel(
      {},
      concorrent,
      0,
      urls.slice(0, concorrent)
    ).then(result => resolve(result))
  })
}
