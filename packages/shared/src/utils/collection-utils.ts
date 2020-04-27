export const keyBy = <T, K extends string>(
  items: T[],
  getKey: (item: T, index: number) => K,
): Readonly<Record<K, T>> => {
  return items.reduce((itemByKey: Record<K, T>, item, index) => {
    const key: K = getKey(item, index)
    itemByKey[key] = item
    return itemByKey
  }, {} as Record<K, T>)
}

export const groupBy = <T, K extends string>(
  items: T[],
  getKey: (item: T, index: number) => K,
): Readonly<Record<K, T[]>> => {
  return items.reduce((groupedItemsByKey, item, index) => {
    const key: K = getKey(item, index)
    const groupedItems = groupedItemsByKey[key] || (groupedItemsByKey[key] = [])
    groupedItems.push(item)
    return groupedItemsByKey
  }, {} as Record<K, T[]>)
}

export const sumBy = <T>(items: T[], getValue: (item: T, index: number) => number): number => {
  return items.reduce((sum, item, index) => sum + getValue(item, index), 0)
}

export const getAllKeys = <T>(items: T[]): string[] => {
  const keys: Record<string, boolean> = {}

  items.forEach((item) => {
    Object.keys(item).forEach((key) => {
      keys[key] = true
    })
  })

  return Object.keys(keys)
}

export const mapValues = <T, K extends string, V>(
  itemByKey: Readonly<Record<K, T>>,
  getValue: (item: T, key: K) => V,
): Readonly<Record<K, V>> => {
  return Object.entries<T>(itemByKey).reduce((valueByKey, [key, item]) => {
    valueByKey[key as K] = getValue(item, key as K)
    return valueByKey
  }, {} as Record<K, V>)
}

export const getMin = <T>(items: T[]): T | undefined => {
  return items.reduce((minItem: T | undefined, item) => {
    return typeof minItem !== 'undefined' && minItem < item ? minItem : item
  }, undefined)
}

export const getMax = <T>(items: T[]): T | undefined => {
  return items.reduce((maxItem: T | undefined, item) => {
    return typeof maxItem !== 'undefined' && maxItem > item ? maxItem : item
  }, undefined)
}
