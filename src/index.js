import {
  getAPI,
  getQuery,
  getQueryInfo,
  getReleaseInfo,
  getScrapers
} from './fetchers'
import { genBBCode, getMedia } from './generators'
import {
  chooseRelease, chooseScraper,
  getDescription,
  getFormat,
  getImage,
  getManual,
  getMoreLinks,
  getReleaseTitle,
  getSpectrograms,
  getTracker
} from './input'

(async () => {
  const API = getAPI()
  const scrapers = getScrapers(await API)
  const tracker = await getTracker()
  const scraper = await chooseScraper(await scrapers)
  const input = await getReleaseTitle()
  const image = tracker === 'RedTopia' ? getImage() : undefined
  const query = getQuery(await API, await input, await scraper)
  const queryResult = getQueryInfo(await query)
  await image
  const chosenRelease = await chooseRelease(await queryResult)
  const releaseInfo = chosenRelease.url
    ? getReleaseInfo(await API, await chosenRelease)
    : await getManual(await input)
  const format = tracker === 'RedTopia' ? await getFormat() : undefined
  const description = await getDescription()
  const links = await getMoreLinks()
  const fulfilledReleaseInfo = await releaseInfo
  const {artists, title, genres, styles, discs, url} = fulfilledReleaseInfo
  const {date} = fulfilledReleaseInfo.releaseEvents[0]
  const labels = fulfilledReleaseInfo.labelIds.map(id => id.label)
  const media = fulfilledReleaseInfo.format.split(',').
    map(item => item.trim(item))
  const {spectrograms} = tracker === 'RedTopia' && await getMedia(media) !==
  'CD' && format.format === 'FLAC'
    ? await getSpectrograms()
    : {spectrograms: undefined}
  const bb = await genBBCode(tracker, await image, artists, title, date, labels,
    format, media, genres, styles, description, discs, links, url, spectrograms)
  const separator = '----------------------------------------'
  console.log(separator)
  console.log('Description BBCode Generated')
  console.log(separator)
  console.log(bb)
  console.log(separator)
})()