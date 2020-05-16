export const queryHelper = {
  getValue (query: string | string[] | undefined): string | undefined {
    if (typeof query === 'undefined') {
      return undefined
    }
    return Array.isArray(query) ? query[0] : query
  },
  getValues (query: string | string[] | undefined): string[] | undefined {
    if (typeof query === 'undefined') {
      return undefined
    }
    return Array.isArray(query) ? query : [query]
  },
}
