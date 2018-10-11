import inq from 'inquirer'

export const getReleaseInfo = async () => {
  await inq.prompt([
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
}