import r2 from 'r2'

export const getAPI = async () => {
  const request = r2.get('https://yadg.cc/api/v2/')
  const response = await request.response
  return response.json()
}

export const getScrapers = async API => {
  const request = r2.get(API.scrapers)
  const response = await request.response
  return response.json()
}

export const getQuery = async (API, input, scraper) => {
  const request = r2.post(API.query, {json: {input, scraper}})
  const response = await request.response
  return response.json()
}

export const getQueryInfo = async query => {
  const request = r2.get(query.url)
  const response = await request.response
  const json = await response.json()
  switch (json.status) {
    case 'waiting':
      return getQueryInfo(query)
    case 'failed':
      throw 'Query failed.'
    case 'done':
      return json.data
    default:
      throw 'Something went wrong...'
  }
}

export const getReleaseInfo = async (API, queryInfo) => getQueryInfo(
  await getQuery(API, queryInfo.url))