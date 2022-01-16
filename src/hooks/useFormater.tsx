import React from 'react'

export const useFormater = () => {
  return function (date?: Date) {
    if (date === undefined) return ''

    const m = date.getMonth() + 1
    const d = date.getDate()

    return `${date.getFullYear()}-${m >= 10 ? m : '0' + m}-${
      d >= 10 ? d : '0' + d
    }`
  }
}
