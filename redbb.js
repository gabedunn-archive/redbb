// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"fetchers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReleaseInfo = exports.getQueryInfo = exports.getQuery = exports.getScrapers = exports.getAPI = void 0;

var _r = _interopRequireDefault(require("r2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getAPI = async () => {
  const request = _r.default.get('https://yadg.cc/api/v2/');

  const response = await request.response;
  return response.json();
};

exports.getAPI = getAPI;

const getScrapers = async API => {
  const request = _r.default.get(API.scrapers);

  const response = await request.response;
  return response.json();
};

exports.getScrapers = getScrapers;

const getQuery = async (API, input, scraper) => {
  const request = _r.default.post(API.query, {
    json: {
      input,
      scraper
    }
  });

  const response = await request.response;
  return response.json();
};

exports.getQuery = getQuery;

const getQueryInfo = async query => {
  const request = _r.default.get(query.url);

  const response = await request.response;
  const json = await response.json();

  switch (json.status) {
    case 'waiting':
      return getQueryInfo(query);

    case 'failed':
      throw 'Query failed.';

    case 'done':
      return json.data;

    default:
      throw 'Something went wrong...';
  }
};

exports.getQueryInfo = getQueryInfo;

const getReleaseInfo = async (API, queryInfo) => getQueryInfo((await getQuery(API, queryInfo.url)));

exports.getReleaseInfo = getReleaseInfo;
},{}],"generators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genBBCode = exports.genSpectrograms = exports.genMoreLinks = exports.genMoreLinksItem = exports.genTrackList = exports.genDescription = exports.genStyles = exports.genGenre = exports.genMedia = exports.genFormat = exports.genType = exports.genLabel = exports.genYear = exports.genTitle = exports.genImage = exports.getMedia = exports.getType = exports.allMedias = exports.allTypes = void 0;
const allTypes = {
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
};
exports.allTypes = allTypes;
const allMedias = {
  'CD': 'CD',
  'WEB': 'WEB',
  'File': 'WEB',
  'DVD': 'DVD',
  'DVD-Video': 'DVD',
  'Vinyl': 'Vinyl',
  'SACD': 'SACD',
  'Blu-Ray': 'Blu-Ray',
  'Cassette': 'Cassette'
};
exports.allMedias = allMedias;

const getType = async types => {
  return new Promise(resolve => {
    types.forEach(types => {
      if (Object.keys(allTypes).includes(types)) {
        resolve(allTypes[types]);
      }
    });
    resolve(types[1]);
  });
};

exports.getType = getType;

const getMedia = async medias => {
  return new Promise(resolve => {
    medias.forEach(media => {
      if (Object.keys(allMedias).includes(media)) {
        resolve(allMedias[media]);
      }
    });
    resolve(medias[0]);
  });
};

exports.getMedia = getMedia;

const format = val => ('0' + Math.floor(val)).slice(-2);

const display = seconds => {
  const hours = seconds / 3600;
  const minutes = seconds % 3600 / 60;
  seconds %= 60;
  return (hours > 1 ? [hours, minutes, seconds] : [minutes, seconds]).map(format).join(':');
};

const genImage = image => `[img]${image}[/img]`;

exports.genImage = genImage;

const genTitle = (artists, title) => `[size=29][b]${artists[0].name} - ${title}[/b][/size]`;

exports.genTitle = genTitle;

const genYear = year => `[b]Released:[/b] ${year}`;

exports.genYear = genYear;

const genLabel = labels => `[b]Label${labels.length > 1 ? 's' : ''}:[/b] ${labels.length > 1 ? labels.join(', ') : labels[0]}`;

exports.genLabel = genLabel;

const genType = async types => {
  const type = await getType(types);
  return `[b]Type:[/b] ${type}`;
};

exports.genType = genType;

const genFormat = (format, bit) => `[b]Format:[/b] ${format} [${bit}]`;

exports.genFormat = genFormat;

const genMedia = async medias => {
  const media = await getMedia(medias);
  return `[b]Media:[/b] ${media}`;
};

exports.genMedia = genMedia;

const genGenre = genre => `[b]Genre${genre.length > 1 ? 's' : ''}:[/b] ${genre.length > 1 ? genre.join(', ') : genre[0]}`;

exports.genGenre = genGenre;

const genStyles = style => `[b]Style${style.length > 1 ? 's' : ''}:[/b] ${style.length > 1 ? style.join(', ') : style[0]}`;

exports.genStyles = genStyles;

const genDescription = description => `[size=18][b]Description:[/b][/size]\r\n${description}`;

exports.genDescription = genDescription;

const genTrackList = discs => {
  const discList = ['[size=18][b]Tracklist:[/b][/size]'];
  discs.forEach(disc => {
    const trackList = discs.length > 1 ? [`[b]Disc ${disc.number}:[/b]`] : [];
    disc.tracks.forEach(track => {
      trackList.push(`[b]${track.number}.[/b] ${track.title}${track.length ? ` (${display(track.length)})` : ''}`);
    });
    discList.push(trackList.join('\r\n'));
  });
  return discList.join('\r\n');
};

exports.genTrackList = genTrackList;

const genMoreLinksItem = (title, url) => `[url=${url}]${title}[/url]`;

exports.genMoreLinksItem = genMoreLinksItem;

const genMoreLinks = (url, links) => {
  return links.length > 0 ? `[b]More Links:[/b]\r\n[url=${url}]More Information[/url]\r\n${links.join('\r\n')}` : `[b][url=${url}]More Information.[/url][/b]`;
};

exports.genMoreLinks = genMoreLinks;

const genSpectrograms = spectrograms => `[b]Spectrograms:[/b]\r\n[spoiler]\r\n[img]${spectrograms.join('[/img]\r\n[img]')}[/img]\r\n[/spoiler]`;

exports.genSpectrograms = genSpectrograms;

const genBBCode = async (tracker, image, artist, title, year, labels, format, media, genres, styles, description, tracks, linksArray, url, spectrograms) => {
  const RTP = tracker === 'RedTopia';
  const links = linksArray.links ? linksArray.links : [];
  const linkBB = Object.entries(links).map(link => genMoreLinksItem(link[0], link[1]));
  const editionInfo = media.filter(item => item.toLowerCase().includes('edition'));
  let bb = image ? `${genImage(image)}\r\n\r\n` : '';
  bb += `${editionInfo.length === 0 ? genTitle(artist, title) : genTitle(artist, `${title}(${editionInfo[0]})`)}\r\n`;
  bb += `${genYear(year)}\r\n`;
  bb += `${genLabel(labels)}\r\n`;
  bb += `${await genType(media)}\r\n`;
  bb += format ? `${genFormat(format.format, format.bit)}\r\n` : '';
  bb += RTP ? `${await genMedia(media)}\r\n` : '';
  bb += genres.length ? `${genGenre(genres)}\r\n` : '';
  bb += styles.length ? `${genStyles(styles)}\r\n\r\n` : '\r\n';
  bb += description.desc ? `${genDescription(description.description)}\r\n\r\n` : '';
  bb += `${genTrackList(tracks)}\r\n\r\n`;
  bb += genMoreLinks(url, linkBB);
  bb += spectrograms ? `\r\n\r\n${genSpectrograms(spectrograms)}` : '';
  return bb;
};

exports.genBBCode = genBBCode;
},{}],"input.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getManual = exports.getSpectrograms = exports.getDescription = exports.getMoreLinks = exports.getFormat = exports.chooseScraper = exports.chooseRelease = exports.getImage = exports.getReleaseTitle = exports.getTracker = void 0;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _generators = require("./generators");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTracker = async () => {
  return (await _inquirer.default.prompt([{
    type: 'list',
    name: 'tracker',
    message: 'Which Tracker:',
    default: 1,
    choices: ['Redacted', 'RedTopia']
  }])).tracker;
};

exports.getTracker = getTracker;

const getReleaseTitle = async () => {
  const answers = await _inquirer.default.prompt([{
    type: 'input',
    name: 'artist',
    message: 'Who is the artist:'
  }, {
    type: 'input',
    name: 'title',
    message: 'What is the release title:'
  }]);
  return `${answers.artist} - ${answers.title}`;
};

exports.getReleaseTitle = getReleaseTitle;

const getImage = async () => {
  return (await _inquirer.default.prompt({
    type: 'input',
    name: 'image',
    message: 'Cover Image URL'
  })).image;
};

exports.getImage = getImage;

const chooseRelease = async releases => {
  const choices = releases.items.map(release => {
    return {
      name: `${release.name} | ${release.info}`,
      value: release.url
    };
  });
  choices.push({
    name: 'Enter Manual Information',
    value: undefined
  });
  return await _inquirer.default.prompt({
    type: 'list',
    name: 'url',
    message: 'Which release:',
    choices
  });
};

exports.chooseRelease = chooseRelease;

const chooseScraper = async scrapers => {
  const defaultChoice = scrapers.filter(scraper => scraper.default)[0].value;
  return (await _inquirer.default.prompt({
    type: 'list',
    name: 'scraper',
    message: 'Which release:',
    choices: scrapers,
    default: defaultChoice
  })).scraper;
};

exports.chooseScraper = chooseScraper;

const getFormat = async () => {
  return await _inquirer.default.prompt([{
    type: 'list',
    name: 'format',
    message: 'What format is the upload:',
    choices: ['FLAC', 'MP3', 'AAC']
  }, {
    type: 'list',
    name: 'bit',
    message: 'What is the bit depth:',
    choices: ['16 bit', '24 bit'],
    when: answers => answers.format === 'FLAC'
  }, {
    type: 'list',
    name: 'bit',
    message: 'What is the bitrate:',
    choices: ['320 CBR', '256 CBR', '192 CBR', new _inquirer.default.Separator(), 'V0 VBR', 'V1 VBR', 'V2 VBR'],
    when: answers => answers.format !== 'FLAC'
  }]);
};

exports.getFormat = getFormat;

const getMoreLinks = async () => {
  return await _inquirer.default.prompt([{
    type: 'checkbox',
    name: 'sources',
    message: 'Include any links?',
    choices: ['MusicBrainz', 'Spotify', 'SoundCloud', 'Discogs', 'Personal Website']
  }, {
    type: 'input',
    name: 'links.MusicBrainz',
    message: 'MusicBrainz link:',
    when: answers => answers.sources.includes('MusicBrainz')
  }, {
    type: 'input',
    name: 'links.Spotify',
    message: 'Spotify link:',
    when: answers => answers.sources.includes('Spotify')
  }, {
    type: 'input',
    name: 'links.SoundCloud',
    message: 'SoundCloud link:',
    when: answers => answers.sources.includes('SoundCloud')
  }, {
    type: 'input',
    name: 'links.Discogs',
    message: 'Discogs link:',
    when: answers => answers.sources.includes('Discogs')
  }, {
    type: 'input',
    name: 'links.Personal Website',
    message: 'Website link:',
    when: answers => answers.sources.includes('Personal Website')
  }]);
};

exports.getMoreLinks = getMoreLinks;

const getDescription = async () => {
  return await _inquirer.default.prompt([{
    type: 'confirm',
    name: 'desc',
    message: 'Do you want to add a description?'
  }, {
    type: 'editor',
    name: 'description',
    message: 'Description of the upload (info/review):',
    when: answers => answers.desc
  }]);
};

exports.getDescription = getDescription;

const getSpectrograms = async () => {
  return await _inquirer.default.prompt({
    type: 'input',
    name: 'spectrograms',
    message: 'Enter a comma separated list of direct urls to the' + ' spectrograms:',
    filter: spectograms => spectograms.split(',').map(item => item.trim(item))
  });
};

exports.getSpectrograms = getSpectrograms;

const getManual = async title => {
  const typeChoices = [...new Set(Object.values(_generators.allTypes))];
  const mediaChoices = [...new Set(Object.values(_generators.allMedias))];
  const splitTitle = title ? title.split(' - ') : 'No Artist - No Title';
  const answers = await _inquirer.default.prompt([{
    type: 'input',
    name: 'year',
    message: 'What year what is released:',
    validate: val => !isNaN(val)
  }, {
    type: 'input',
    name: 'genre',
    message: 'What is the main genre:',
    default: 'none'
  }, {
    type: 'list',
    name: 'type',
    message: 'What sort of upload is this:',
    choices: typeChoices
  }, {
    type: 'input',
    name: 'label',
    message: 'What is the record label (optional):',
    default: 'none'
  }, {
    type: 'input',
    name: 'url',
    message: 'What is the release url (MusicBrainz, Dicogs, SoundCloud' + ' etc.):'
  }, {
    type: 'list',
    name: 'media',
    message: 'What is the release media:',
    choices: mediaChoices
  }, {
    type: 'input',
    name: 'tracklist',
    message: 'Enter a comma separated list of the tracks in the order they appear on the album:',
    filter: tracks => tracks.split(',').map((item, i) => {
      return {
        number: `${i}`,
        title: item.trim(item)
      };
    })
  }]);
  return {
    manual: true,
    styles: [],
    format: `${answers.media}, ${answers.type}`,
    artists: [{
      name: splitTitle[0]
    }],
    releaseEvents: [{
      date: answers.year
    }],
    title: splitTitle[1],
    url: answers.url,
    discs: [{
      tracks: answers.tracklist,
      number: 1
    }],
    labelIds: [{
      label: answers.label
    }]
  };
};

exports.getManual = getManual;
},{"./generators":"generators.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _fetchers = require("./fetchers");

var _generators = require("./generators");

var _input = require("./input");

(async () => {
  const API = (0, _fetchers.getAPI)();
  const scrapers = (0, _fetchers.getScrapers)((await API));
  const tracker = await (0, _input.getTracker)();
  const scraper = await (0, _input.chooseScraper)((await scrapers));
  const input = await (0, _input.getReleaseTitle)();
  const image = tracker === 'RedTopia' ? (0, _input.getImage)() : undefined;
  const query = (0, _fetchers.getQuery)((await API), (await input), (await scraper));
  const queryResult = (0, _fetchers.getQueryInfo)((await query));
  await image;
  const chosenRelease = await (0, _input.chooseRelease)((await queryResult));
  const releaseInfo = chosenRelease.url ? (0, _fetchers.getReleaseInfo)((await API), (await chosenRelease)) : await (0, _input.getManual)((await input));
  const format = tracker === 'RedTopia' ? await (0, _input.getFormat)() : undefined;
  const description = await (0, _input.getDescription)();
  const links = await (0, _input.getMoreLinks)();
  const fulfilledReleaseInfo = await releaseInfo;
  const {
    artists,
    title,
    genres,
    styles,
    discs,
    url
  } = fulfilledReleaseInfo;
  const {
    date
  } = fulfilledReleaseInfo.releaseEvents[0];
  const labels = fulfilledReleaseInfo.labelIds.map(id => id.label);
  const media = fulfilledReleaseInfo.format.split(',').map(item => item.trim(item));
  const {
    spectrograms
  } = tracker === 'RedTopia' && (await (0, _generators.getMedia)(media)) !== 'CD' && format.format === 'FLAC' ? await (0, _input.getSpectrograms)() : {
    spectrograms: undefined
  };
  const bb = await (0, _generators.genBBCode)(tracker, (await image), artists, title, date, labels, format, media, genres, styles, description, discs, links, url, spectrograms);
  const separator = '----------------------------------------';
  console.log(separator);
  console.log('Description BBCode Generated');
  console.log(separator);
  console.log(bb);
  console.log(separator);
})();
},{"./fetchers":"fetchers.js","./generators":"generators.js","./input":"input.js"}]},{},["index.js"], null)