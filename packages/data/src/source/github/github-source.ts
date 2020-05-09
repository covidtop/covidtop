import axios from 'axios'

const baseUrl = 'https://raw.githubusercontent.com'

const downloadFile = async (owner: string, repo: string, filePath: string, ref = 'master'): Promise<string> => {
  return (await axios.get(`${baseUrl}/${owner}/${repo}/${ref}/${filePath}`, { responseType: 'text' })).data
}

export const gitHubSource = {
  downloadFile,
}
