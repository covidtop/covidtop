import { downloader } from '../common'

const baseUrl = 'https://raw.githubusercontent.com'

const downloadFile = async (owner: string, repo: string, filePath: string, ref = 'master'): Promise<string> => {
  return downloader.getText(`${baseUrl}/${owner}/${repo}/${ref}/${filePath}`)
}

export const gitHubSource = {
  downloadFile,
}
