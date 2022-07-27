/* eslint-disable no-unused-expressions */
import Sinon from 'sinon'
import * as nodeFetchMod from 'node-fetch'
import { urls } from '../../utils'
import { fetch } from './fetch'
import { expect } from 'chai'



describe(__filename, () => {
  afterEach(Sinon.restore)

  it('should execute fetch request just fine', async () => {
    const url = urls[0]

    const nodeFetchStub = Sinon.stub(nodeFetchMod, 'default')
    const mockedResponse = { url } as nodeFetchMod.Response

    nodeFetchStub.returns(Promise.resolve(mockedResponse))


    const response = await fetch({
      url
    })

    expect(response).to.deep.eq(mockedResponse)

    expect(nodeFetchStub.callCount).to.be.eq(1)
    expect(nodeFetchStub.firstCall.args[0]).to.deep.eq(url)
  })

  it('should ensure fetch is called with given request options', async () => {
    const url = urls[0]

    const requestOptions: nodeFetchMod.RequestInit = {
      body: 'body',
      headers: {},
      size: 1,
      method: 'GET',
      redirect: 'follow'
    }

    const nodeFetchStub = Sinon.stub(nodeFetchMod, 'default')
    const mockedResponse = { url } as nodeFetchMod.Response

    nodeFetchStub.returns(Promise.resolve(mockedResponse))


    const response = await fetch({
      url,
      requestOptions
    })

    expect(response).to.deep.eq(mockedResponse)

    expect(nodeFetchStub.callCount).to.be.eq(1)
    expect(nodeFetchStub.firstCall.args).to.deep.eq([
      url,
      requestOptions
    ])
  })

  it('should not abort requests before exceeding timeout', async () => {
    const url = urls[0]
    const timeout = 1000

    const timeoutSpy = Sinon.spy(global, 'setTimeout')
    const clearTimeoutSpy = Sinon.spy(global, 'clearTimeout')


    const mockedResponse = { url } as nodeFetchMod.Response
    const errorMessage = 'aborted by user'
    let rejectFetch: (reason: any) => void

    const nodeFetchStub = Sinon.stub(nodeFetchMod, 'default')
    nodeFetchStub.returns(new Promise((resolve, reject) => {
      rejectFetch = reject
      const timeoutIdentifier = setTimeout(() => {
        // promise will resolve 100ms before timeout, therefore should not be aborted
        resolve(mockedResponse)
        clearTimeoutSpy(timeoutIdentifier)
      }, timeout - 100)
    }))

    const abortSpy = Sinon.spy(() => rejectFetch(new Error(errorMessage)))
    const mockedAbortController = {
      abort: abortSpy
    }

    const fakeAbortControllerConstructor = Sinon.spy(function () {
      return mockedAbortController
    }) as any

    Sinon.replace(
      global,
      'AbortController',
      fakeAbortControllerConstructor
    )

    let error
    let response: { url: string } | undefined

    try {
      response = await fetch({
        url,
        timeout
      })
    } catch (err) {
      error = err
    }

    expect(error).not.to.be.ok

    // response is successful
    expect(response).to.be.ok
    expect(response!.url).to.be.eq(url)


    expect(timeoutSpy.callCount).to.be.eq(2)

    expect(clearTimeoutSpy.callCount).to.be.eq(2)

    expect(fakeAbortControllerConstructor.callCount).to.be.eq(1)

    // abort is never called
    expect(abortSpy.callCount).to.be.eq(0)

    expect(nodeFetchStub.callCount).to.be.eq(1)
    expect(nodeFetchStub.firstCall.args[0]).to.deep.eq(url)
  })

  it('should abort ingoing request if timeout is exceeded', async () => {
    const url = urls[0]
    const timeout = 1000

    const timeoutSpy = Sinon.spy(global, 'setTimeout')
    const clearTimeoutSpy = Sinon.spy(global, 'clearTimeout')


    const errorMessage = 'aborted by user'
    let rejectFetch: (reason: any) => void

    const nodeFetchStub = Sinon.stub(nodeFetchMod, 'default')
    nodeFetchStub.returns(new Promise((_resolve, reject) => {
      // promise does not reject immediately and is going to sleep till reject is called
      rejectFetch = reject
    }))

    const abortSpy = Sinon.spy(() => rejectFetch(new Error(errorMessage)))
    const mockedAbortController = {
      abort: abortSpy
    }

    const fakeAbortControllerConstructor = Sinon.spy(function () {
      return mockedAbortController
    }) as any

    Sinon.replace(
      global,
      'AbortController',
      fakeAbortControllerConstructor
    )

    let error
    let response

    try {
      response = await fetch({
        url,
        timeout
      })
    } catch (err) {
      error = err
    }

    expect(response).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq(errorMessage)

    const timeoutId = timeoutSpy.returnValues[0]

    expect(timeoutSpy.callCount).to.be.eq(1)

    expect(clearTimeoutSpy.callCount).to.be.eq(1)
    expect(clearTimeoutSpy.firstCall.args[0]).to.deep.eq(timeoutId)

    expect(fakeAbortControllerConstructor.callCount).to.be.eq(1)
    // abort is called
    expect(abortSpy.callCount).to.be.eq(1)

    expect(nodeFetchStub.callCount).to.be.eq(1)
    expect(nodeFetchStub.firstCall.args[0]).to.deep.eq(url)
  })
})
