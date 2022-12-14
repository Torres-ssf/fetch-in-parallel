import { IFetchInParallelReturns } from '../lib/fetchInParallel'



export const countSuccessfulRequests = (
  response: IFetchInParallelReturns
): number => {
  let counter = 0

  for (const url in response) {
    if (response[url].success) {
      counter += 1
    }
  }

  return counter
}


export const urls = [
  'https://www.google.com',
  'https://www.youtube.com',
  'https://www.facebook.com',
  'https://www.amazon.com',
  'https://www.apple.com',
  'https://www.reddit.com',
  'https://www.yahoo.com',
  'https://www.twitter.com',
  'https://www.bing.com',
  'https://www.instagram.com',
  'https://www.paypal.com',
  'https://www.fandom.com',
  'https://www.walmart.com',
  'https://www.linkedin.com',
  'https://www.weather.com',
  'https://www.nytimes.com',
  'https://www.ebay.com',
  'https://www.indeed.com',
  'https://www.quora.com',
  'https://www.imdb.com',
  'https://www.usps.com',
  'https://www.cnn.com',
  'https://www.tiktok.com',
  'https://www.etsy.com',
  'https://www.tapresearch.com',
  'https://www.duckduckgo.com',
  'https://www.office.com',
  'https://www.microsoft.com',
  'https://www.live.com',
  'https://www.zillow.com',
  'https://www.espn.com',
  'https://www.jpost.com',
  'https://www.netflix.com',
  'https://www.homedepot.com',
  'https://www.foxnews.com',
  'https://www.intuit.com',
  'https://www.quizlet.com',
  'https://www.target.com',
  'https://www.hulu.com',
  'https://www.discord.com',
  'https://www.healthline.com',
  'https://www.pinterest.com',
  'https://www.chase.com',
  'https://www.mangakakalot.com',
  'https://www.imgur.com',
  'https://www.doordash.com',
  'https://www.tumblr.com',
  'https://www.github.com',
  'https://www.heroku.com',
  'https://www.spotify.com',
  'https://www.yelp.com',
  'https://www.fedex.com',
  'https://www.stackoverflow.com',
  'https://www.t-mobile.com',
  'https://www.wordpress.com',
  'https://www.blogspot.com',
  'https://www.msn.com',
  'https://www.att.com',
  'https://www.ups.com',
  'https://www.shein.com',
  'https://www.capitalone.com',
  'https://www.adobe.com',
  'https://www.nypost.com',
  'https://www.webmd.com',
  'https://www.affirm.com',
  'https://www.realtor.com',
  'https://www.aol.com',
  'https://www.xfinity.com',
  'https://www.uber.com',
  'https://www.wellsfargo.com'
]
