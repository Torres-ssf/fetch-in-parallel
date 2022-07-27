import nodeFetch, { RequestInfo, RequestInit, Response } from 'node-fetch'
import { AbortSignal } from 'node-fetch/externals'



export interface IFetchParams {
  url: RequestInfo,
  requestOptions?: RequestInit
  timeout?: number
}

export const fetch = async (
  params: IFetchParams
): Promise<Response> => {
  const { url, requestOptions = {}, timeout } = params

  let abortController: AbortController | undefined

  let nodeTimeoutId: NodeJS.Timeout | undefined

  if (timeout) {
    abortController = new AbortController()

    nodeTimeoutId = setTimeout(() => {
      clearTimeout(nodeTimeoutId)
      abortController!.abort()
    }, timeout)
  }

  const response = await nodeFetch(url, {
    ...requestOptions,
    ...(abortController ? { signal: abortController.signal as AbortSignal } : {})
  })

  nodeTimeoutId && clearTimeout(nodeTimeoutId)

  return response
}
