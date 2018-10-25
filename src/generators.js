export const allTypes = {
  'Album': 'Album',
  'Single': 'Single',
  'Remix': 'Remix',
  'Anthology': 'Anthology',
  'Compilation': 'Compilation',
  'EP': 'EP',
  'LP': 'Album',
  'Mixtape': 'Mixtape',
  'Soundtrack': 'Soundtrack',
  'Bootleg': 'Bootleg',
  'Promo': 'Promo',
  'Demo': 'Demo'
}

export const allMedias = {
  'CD': 'CD',
  'WEB': 'WEB',
  'File': 'WEB',
  'DVD': 'DVD',
  'DVD-Video': 'DVD',
  'Vinyl': 'Vinyl',
  'SACD': 'SACD',
  'Blu-Ray': 'Blu-Ray',
  'Cassette': 'Cassette'
}

export const getType = async types => {
  return new Promise((resolve => {
    types.forEach(types => {
      if (Object.keys(allTypes).includes(types)) {
        resolve(allTypes[types])
      }
    })
    resolve(types[1])
  }))
}

export const getMedia = async medias => {
  return new Promise((resolve => {
    medias.forEach(media => {
      if (Object.keys(allMedias).includes(media)) {
        resolve(allMedias[media])
      }
    })
    resolve(medias[0])
  }))
}

const format = val => ('0' + Math.floor(val)).slice(-2)

const display = seconds => {
  const hours = seconds / 3600
  const minutes = (seconds % 3600) / 60
  seconds %= 60
  return (hours > 1 ? [hours, minutes, seconds] : [minutes, seconds]).map(
    format).join(':')
}

export const genImage = image => `[img]${image}[/img]`

export const genTitle = (
  artists, title) => `[size=29][b]${artists[0].isVarious
  ? 'Various'
  : artists[0].name} - ${title}[/b][/size]`

export const genYear = year => `[b]Released:[/b] ${year}`

export const genLabel = labels => `[b]Label${labels.length > 1
  ? 's'
  : ''}:[/b] ${labels.length > 1
  ? labels.join(', ')
  : labels[0]}`

export const genType = async types => {
  const type = await getType(types)
  return `[b]Type:[/b] ${type}`
}

export const genFormat = (
  format, bit) => bit
  ? `[b]Format:[/b] ${format} [${bit}]`
  : `[b]Format:[/b] ${format}`

export const genMedia = async medias => {
  const media = await getMedia(medias)
  return `[b]Media:[/b] ${media}`
}

export const genGenre = genre => `[b]Genre${genre.length > 1
  ? 's'
  : ''}:[/b] ${genre.length > 1
  ? genre.join(', ')
  : genre[0]}`

export const genStyles = style => `[b]Style${style.length > 1
  ? 's'
  : ''}:[/b] ${style.length > 1
  ? style.join(', ')
  : style[0]}`

export const genDescription =
  description => `[size=18][b]Description:[/b][/size]\r\n${description}`

export const genTrackList = discs => {
  const discList = ['[size=18][b]Tracklist:[/b][/size]']
  discs.forEach(disc => {
    const trackList = discs.length > 1 ? [`[b]Disc ${disc.number}:[/b]`] : []
    disc.tracks.forEach(track => {
        trackList.push(
          `[b]${track.number}.[/b] ${track.title}${track.length
            ? ` (${display(track.length)})`
            : ''}`)
      }
    )
    discList.push(trackList.join('\r\n'))
  })
  return discList.join('\r\n')
}

export const genMoreLinksItem = (title, url) =>
  `[url=${url}]${title}[/url]`

export const genMoreLinks = (url, links) => {
  return links.length > 0
    ? `[b]More Links:[/b]\r\n[url=${url}]More Information[/url]\r\n${links.join(
      '\r\n')}`
    : `[b][url=${url}]More Information.[/url][/b]`
}

export const genSpectrograms =
  spectrograms => `[b]Spectrograms:[/b]\r\n[spoiler]\r\n[img]${spectrograms.join(
    '[/img]\r\n[img]')}[/img]\r\n[/spoiler]`

export const genBBCode = async (
  tracker, image, artist, title, year, labels, format, media, genres, styles,
  description, tracks, linksArray, url, spectrograms) => {
  const RTP = tracker === 'RedTopia'
  const links = linksArray.links ? linksArray.links : []
  const linkBB = Object.entries(links).
    map(link => genMoreLinksItem(link[0], link[1]))
  const editionInfo = media.filter(
    item => item.toLowerCase().includes('edition'))

  let bb = image ? `${genImage(image)}\r\n\r\n` : ''
  bb += `${editionInfo.length === 0 ? genTitle(artist, title) : genTitle(
    artist, `${title}(${editionInfo[0]})`)}\r\n`
  bb += `${genYear(year)}\r\n`
  bb += `${genLabel(labels)}\r\n`
  bb += `${await genType(media)}\r\n`
  bb += format ? `${genFormat(format.format, format.bit)}\r\n` : ''
  bb += RTP ? `${await genMedia(media)}\r\n` : ''
  bb += genres && genres.length ? `${genGenre(genres)}\r\n` : ''
  bb += styles && styles.length ? `${genStyles(styles)}\r\n\r\n` : '\r\n'
  bb += description.desc ? `${genDescription(
    description.description)}\r\n\r\n` : ''
  bb += `${genTrackList(tracks)}\r\n\r\n`
  bb += genMoreLinks(url, linkBB)
  bb += spectrograms ? `\r\n\r\n${genSpectrograms(spectrograms)}` : ''
  return bb
}
