/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { fetchInParallel } from '../../src/lib/fetchInParallel'
import { fetchParallelWithPromiseAll } from '../../src/lib/other-solutions/fetchParallelWithPromiseAll'
import { urls, countSuccessfulRequests } from '../../src/utils'



describe('integration tests', () => {
  it('should ensure fetchInParallel is faster than using fetchParallelWithPromiseAll', async () => {
    const concorrent = 5
    const timeout = 5000

    console.info(
      templateMerge(
        templatesDict.startWithLimit,
        ['fetchInParallel', String(concorrent)]
      )
    )

    const startfetchInParallel = Date.now()

    const responsefetchInParallel = await fetchInParallel({
      concorrent,
      urls,
      timeout
    })

    const endfetchInParallel = Date.now()

    const fetchInParallelExecDuration = (endfetchInParallel - startfetchInParallel) / 1000

    console.info(
      templateMerge(
        templatesDict.end,
        ['fetchInParallel', String(fetchInParallelExecDuration)]
      )
    )

    let successRequestsCount = countSuccessfulRequests(responsefetchInParallel)

    console.info(
      templateMerge(
        templatesDict.success,
        ['fetchInParallel', String(successRequestsCount)]
      )
    )

    expect(successRequestsCount).to.be.greaterThan(0)



    console.info(
      templateMerge(
        templatesDict.startWithLimit,
        ['fetchParallelWithPromiseAll', String(concorrent)]
      )
    )

    const startPromiseAll = Date.now()

    const responsePromiseAll = await fetchParallelWithPromiseAll({
      concorrent,
      urls,
      timeout
    })

    const endPromiseAll = Date.now()

    const promiseAllExecDuration = (endPromiseAll - startPromiseAll) / 1000

    console.info(
      templateMerge(
        templatesDict.end,
        ['fetchParallelWithPromiseAll', String(promiseAllExecDuration)]
      )
    )

    successRequestsCount = countSuccessfulRequests(responsePromiseAll)

    console.info(
      templateMerge(
        templatesDict.success,
        ['fetchParallelWithPromiseAll', String(successRequestsCount)]
      )
    )

    expect(successRequestsCount).to.be.greaterThan(0)

    expect(fetchInParallelExecDuration).lessThan(promiseAllExecDuration)
  })

  it('should ensure fetchParallelWithPromiseAll solution is faster when fetching all urls concurrently', async () => {
    const concorrent = urls.length
    const timeout = 5000

    console.info(
      templateMerge(
        templatesDict.start,
        ['fetchInParallel']
      )
    )

    const startfetchInParallel = Date.now()

    const responsefetchInParallel = await fetchInParallel({
      concorrent,
      urls,
      timeout
    })

    const endfetchInParallel = Date.now()

    const fetchInParallelExecDuration = (endfetchInParallel - startfetchInParallel) / 1000

    console.info(
      templateMerge(
        templatesDict.end,
        ['fetchInParallel', String(fetchInParallelExecDuration)]
      )
    )

    let successRequestsCount = countSuccessfulRequests(responsefetchInParallel)

    console.info(
      templateMerge(
        templatesDict.success,
        ['fetchInParallel', String(successRequestsCount)]
      )
    )

    expect(successRequestsCount).to.be.greaterThan(0)



    console.info(
      templateMerge(
        templatesDict.start,
        ['fetchParallelWithPromiseAll']
      )
    )

    const startPromiseAll = Date.now()

    const responsePromiseAll = await fetchParallelWithPromiseAll({
      concorrent,
      urls,
      timeout
    })

    const endPromiseAll = Date.now()

    const promiseAllExecDuration = (endPromiseAll - startPromiseAll) / 1000

    console.info(
      templateMerge(
        templatesDict.end,
        ['fetchParallelWithPromiseAll', String(promiseAllExecDuration)]
      )
    )

    successRequestsCount = countSuccessfulRequests(responsePromiseAll)

    console.info(
      templateMerge(
        templatesDict.success,
        ['fetchParallelWithPromiseAll', String(successRequestsCount)]
      )
    )

    expect(successRequestsCount).to.be.greaterThan(0)

    expect(promiseAllExecDuration).lessThan(fetchInParallelExecDuration)
  })



  function templateMerge (
    template: string,
    values: string[]
  ): string {
    let result = template
    values.forEach((value, index) => {
      result = result.replace(new RegExp(`\\{${index}\\}`), value)
    })

    return `:::: ${result} ::::`
  }

  const templatesDict: Record<string, string> = {
    start: 'starting {0} solution with not limit of urls at the same time',
    startWithLimit: 'starting {0} solution with limit of {1} urls at same time',
    end: '{0} solution ended within {1} secs',
    success: '{0} solution had {1} successful requests'
  }
})
