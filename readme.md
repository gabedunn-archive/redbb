## **RedBB - Torrent Description Generator**

A few days ago I made a description generator that you had to input everything manually. Today, I finished a version where it fetches pretty much everything from an API for you. Enjoy.

As a frequent uploader of torrents, I sometimes find it redundant and repetitive to fill out the description with the exact same layout, the only difference being the information plugged into the BBCode. To solve this problem, I have made the RedBB. [Here is an upload that I used the generator for](https://redtopia.xyz/torrents/lunar-vacation-swell-2018-web-flac.9101).


## **Installation:**
The only things you have to do to install the script is install [nodejs](https://nodejs.org). Once that is installed, clone/download the [repo from GitHub](https://github.com/redxtech/RedBB). Once you have the repo on your computer, open up a command prompt (cmd.exe on windows and your terminal on macOS or linux) and [cd](https://www.digitalcitizen.life/command-prompt-how-use-basic-commands) into the repo folder. You should already have [npm](https://npmjs.org) installed from installing node, so simply type `npm install` and wait for the dependencies to install. The script is now ready to use.


## **Usage:**
To use the script, open up the same directory that you saved the script to in a command prompt (you can leave the same one open if you just installed it) and run `npm start` Once you run this command it will ask you all the necessary questions.


## **Options:**

**Tracker**
This will just ask which tracker you are going to upload the torrent to. This will change whether some torrent specific information is asked, such as codec and bitrate if you choose RedTopia, as that stuff will not go into the description on Redacted.

**Artist**
This is simply the artist of the track.

**Title**
The title of the album/song/release.

**Image Link**
This is just a link to the cover image of the release for the description. This will only be asked if you selected RedTopia as the tracker at the beginning.

**Release**
This will show a list of releases that the script was able to pull from the scraper. Select the one that is the most similar to the files you're uploading, or choose enter information manually to manually specify all the information if there isn't a release that matches what you're looking for. Keep in mind that if it doesn't find anything you can try a different scraper before entering the information manually. Just restart the script (ctrl + c to exit) and start it up and choose a different scraper.

**Format**
This is the format of the files you are uploading.

**Bit (rate/depth)**
If you chose FLAC for the previous answer, you will be asked the bit depth of the files. If you chose another format you will be asked the bitrate. This will only be asked if you selected RedTopia as the tracker at the beginning.

**Links**
Press space to choose which external links you want to include. For each one you select an additional question will be asked to get that link.

**Description**
You can choose whether to add a description if you would like to. This is just a description of the release. You can find these on wikipedia or discogs fairly easily. This will open in an editor. The editor to use is determined by reading the $VISUAL or $EDITOR environment variables. If neither of those are present, notepad (on Windows) or vim (Linux or Mac) is used.

**Spectrograms**
Enter a comma separated list of direct links to the spectrogram images. This will only be asked if you selected RedTopia as the tracker, FLAC as the format, and anything other than CD as the media.

**Manual Options:**

**Year**
The year the album/song/release was released.

**Genre**
The genre on the upload.

**Type**
The type of release. The only one that makes a difference in future questions is single - if you select that option you will not be asked for a tracklist and the original title will be used as the sole track.

**Label**
The record label of the release. This is optional.

**URL**
A URL to some place like MusicBrainz, Discogs, Spotify, SoundCloud, or etc. where people can find more information.

**Media**
This is the release media - whether you got it from a CD, DVD, or WEB download.

**Tracklist**
Enter a comma separated list of the tracks on the release. For example, `Song 1, Song the Second, The Third Song`.

## **Suggestions:**
If you have any suggestions on how I can improve this, feel free to leave a comment or send me a PM. I'm happy to improve incorporate any of your suggestions into the script if they would benefit it.