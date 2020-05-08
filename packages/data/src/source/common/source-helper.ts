import dashify from 'dashify'

const getCodeFromName = (name: string): string => {
  return dashify(name, { condense: true })
}

export const sourceHelper = {
  getCodeFromName,
}
