/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { urls } from '../utils'
import * as fetchWithTimeoutMod from './fetch/fetch'
import { Response } from 'node-fetch'
import { fetchInParallel } from './fetchInParallel'
import Sinon from 'sinon'



describe(__filename, () => {
  afterEach(Sinon.restore)

  it('should ensure all urls are being fetched', async () => {
    const mockedFetch = Sinon.spy(
      async (params: fetchWithTimeoutMod.IFetchParams) => ({
        text: async () => Promise.resolve(params.url)
      })
    )

    Sinon.replace(fetchWithTimeoutMod, 'fetch', mockedFetch as any)
    const urlsArr = urls.slice(0, 6)

    const resolved = await fetchInParallel({
      urls: urlsArr,
      concorrent: 3
    })

    expect(mockedFetch.callCount).to.be.eq(urlsArr.length)

    urlsArr.forEach((url) => {
      expect(mockedFetch.calledWithExactly({ url })).to.be.ok

      expect(resolved[url].text).to.be.eq(url)
      expect(resolved[url].success).to.be.ok
    })
  })

  it('should ensure timeout param is being informed when is given', async () => {
    const fetchStub = Sinon.stub(fetchWithTimeoutMod, 'fetch')

    const testUrl = urls[0]

    const textResponse = testUrl

    const fetchResponse = {
      text: () => Promise.resolve(textResponse)
    } as Response

    fetchStub.returns(Promise.resolve(fetchResponse))

    const concorrent = 3
    const timeout = 1000

    const resolved = await fetchInParallel({
      urls: [testUrl],
      concorrent,
      timeout
    })

    expect(fetchStub.callCount).to.be.eq(1)
    expect(fetchStub.calledWithExactly({
      url: testUrl,
      timeout
    })).to.be.ok

    expect(resolved).to.deep.eq({
      [testUrl]: {
        text: textResponse,
        success: true
      }
    })
  })

  it('should properly handle request errors', async () => {
    const fetchStub = Sinon.stub(fetchWithTimeoutMod, 'fetch')

    const testUrls = urls.slice(0, 2)

    const textResponse = testUrls[1]

    const fetchResponse = {
      text: () => Promise.resolve(textResponse)
    } as Response

    const errorMsg = 'website is down'
    const error = new Error(errorMsg)

    fetchStub.onFirstCall().returns(Promise.resolve(fetchResponse))
    fetchStub.onSecondCall().returns(Promise.reject(error))

    const concorrent = 3
    const timeout = 1000

    const resolved = await fetchInParallel({
      urls: testUrls,
      concorrent,
      timeout
    })

    expect(fetchStub.callCount).to.be.eq(2)

    expect(fetchStub.calledWithExactly({
      url: testUrls[0],
      timeout
    })).to.be.ok

    expect(resolved).to.deep.eq({
      [testUrls[0]]: {
        text: errorMsg,
        success: false
      },
      [testUrls[1]]: {
        text: textResponse,
        success: true
      }
    })
  })
})
