import { downloader } from './downloader'

const baseUrl = 'https://raw.githubusercontent.com'

const getContent = async (owner: string, repo: string, filePath: string, ref = 'master'): Promise<string> => {
  return downloader.getText(`${baseUrl}/${owner}/${repo}/${ref}/${filePath}`)
}

export const gitHubApi = {
  getContent,
}
