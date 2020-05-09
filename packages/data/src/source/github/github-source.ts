import { downloader } from '../common'

const baseUrl = 'https://raw.githubusercontent.com'

const getContent = async (owner: string, repo: string, filePath: string, ref = 'master'): Promise<string> => {
  return downloader.getText(`${baseUrl}/${owner}/${repo}/${ref}/${filePath}`)
}

export const gitHubSource = {
  getContent,
}
