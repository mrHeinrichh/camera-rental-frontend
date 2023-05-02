export const splitKey = (key) => {
  if (typeof key !== 'string') {
    return []
  }
  return key.split('.')
}

export const deconstruct = (key, row) =>
  splitKey(key).reduce((a, b) => a[b], row)

export const manipulate = (value, row, operation) => operation(value, row)
