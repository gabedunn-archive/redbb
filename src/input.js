import inq from 'inquirer'
import { allMedias, allTypes } from './generators'

export const getTracker = async () => {
  return (await inq.prompt([
    {
      type: 'list',
      name: 'tracker',
      message: 'Which Tracker:',
      default: 1,
      choices: ['Redacted', 'RedTopia']
    }
  ])).tracker
}

export const getReleaseTitle = async () => {
  const answers = await inq.prompt([
    {
      type: 'input',
      name: 'artist',
      message: 'Who is the artist:'
    },
    {
      type: 'input',
      name: 'title',
      message: 'What is the release title:'
    }
  ])
  return `${ answers.artist } - ${ answers.title }`
}

export const getImage = async () => {
  return (await inq.prompt(
    {
      type: 'input',
      name: 'image',
      message: 'Cover Image URL'
    }
  )).image
}

export const chooseRelease = async releases => {
  const choices = releases.items.map(release => {
    return {
      name: `${ release.name } | ${ release.info }`,
      value: release.url
    }
  })
  choices.push({
    name: 'Enter Manual Information',
    value: undefined
  })
  return await inq.prompt({
    type: 'list',
    name: 'url',
    message: 'Which release:',
    choices
  })
}

export const getFormat = async () => {
  return await inq.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'What format is the upload:',
      choices: ['FLAC', 'MP3', 'AAC']
    },
    {
      type: 'list',
      name: 'bit',
      message: 'What is the bit depth:',
      choices: ['16 bit', '24 bit'],
      when: answers => answers.format === 'FLAC'
    },
    {
      type: 'list',
      name: 'bit',
      message: 'What is the bitrate:',
      choices: [
        '320 CBR',
        '256 CBR',
        '192 CBR',
        new inq.Separator(),
        'V0 VBR',
        'V1 VBR',
        'V2 VBR'
      ],
      when: answers => answers.format !== 'FLAC'
    }
  ])
}

export const getMoreLinks = async () => {
  return await inq.prompt([
    {
      type: 'checkbox',
      name: 'sources',
      message: 'Include any links?',
      choices: [
        'MusicBrainz',
        'Spotify',
        'SoundCloud',
        'Discogs',
        'Personal Website']
    },
    {
      type: 'input',
      name: 'links.MusicBrainz',
      message: 'MusicBrainz link:',
      when: answers => answers.sources.includes('MusicBrainz')
    },
    {
      type: 'input',
      name: 'links.Spotify',
      message: 'Spotify link:',
      when: answers => answers.sources.includes('Spotify')
    },
    {
      type: 'input',
      name: 'links.SoundCloud',
      message: 'SoundCloud link:',
      when: answers => answers.sources.includes('SoundCloud')
    },
    {
      type: 'input',
      name: 'links.Discogs',
      message: 'Discogs link:',
      when: answers => answers.sources.includes('Discogs')
    },
    {
      type: 'input',
      name: 'links.Personal Website',
      message: 'Website link:',
      when: answers => answers.sources.includes('Personal Website')
    }
  ])
}

export const getDescription = async () => {
  return await inq.prompt([
    {
      type: 'confirm',
      name: 'desc',
      message: 'Do you want to add a description?'
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Description of the upload (info/review):',
      when: answers => answers.desc
    }
  ])
}

export const getSpectrograms = async () => {
  return await inq.prompt(
    {
      type: 'input',
      name: 'spectrograms',
      message: 'Enter a comma separated list of direct urls to the' +
        ' spectrograms:',
      filter: spectograms => spectograms.split(',').map(item => item.trim(item))
    }
  )
}

export const getManual = async (title) => {
  const typeChoices = [...new Set(Object.values(allTypes))]
  const mediaChoices = [...new Set(Object.values(allMedias))]
  const splitTitle = title ? title.split(' - ') : 'No Artist - No Title'

  const answers = await inq.prompt([
    {
      type: 'input',
      name: 'year',
      message: 'What year what is released:',
      validate: val => !isNaN(val)
    },
    {
      type: 'input',
      name: 'genre',
      message: 'What is the main genre:',
      default: 'none'
    },
    {
      type: 'list',
      name: 'type',
      message: 'What sort of upload is this:',
      choices: typeChoices
    },
    {
      type: 'input',
      name: 'label',
      message: 'What is the record label (optional):',
      default: 'none'
    },
    {
      type: 'input',
      name: 'url',
      message: 'What is the release url (MusicBrainz, Dicogs, SoundCloud' +
        ' etc.):'
    },
    {
      type: 'list',
      name: 'media',
      message: 'What is the release media:',
      choices: mediaChoices
    },
    {
      type: 'input',
      name: 'tracklist',
      message: 'Enter a comma separated list of the tracks in the order they appear on the album:',
      filter: tracks => tracks.split(',').map((item, i) => {
        return {
          number: `${ i }`,
          title: item.trim(item)
        }
      })
    }
  ])

  return {
    manual: true,
    styles: [],
    format: `${ answers.media }, ${ answers.type }`,
    artists: [{name: splitTitle[0]}],
    releaseEvents: [{date: answers.year}],
    genres: [answers.genre],
    title: splitTitle[1],
    url: answers.url,
    discs: [
      {
        tracks: answers.tracklist,
        number: 1
      }
    ],
    labelIds: [{label: answers.label}]
  }
}