import { fetchInParallel } from './lib/fetchInParallel'
import { countSuccessfulRequests, urls } from './utils'



const concorrent = Number(process.argv[2]) || 5
const timeout = 5000

const fetchUrls = async (urls: string[], concorrent: number) => {
  try {
    const result = await fetchInParallel({
      urls,
      concorrent,
      timeout
    })

    const num = countSuccessfulRequests(result)

    const msg = `Successfully fetched ${num} urls (max ${concorrent} concurrently)`

    console.info(msg)
  } catch (err) {
    console.error(err)
  }
}

fetchUrls(urls, concorrent)
