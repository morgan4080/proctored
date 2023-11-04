import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Service } from '@/lib/service_types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  const parts = name.split(' ')
  let initials = ''
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length > 0 && parts[i] !== '') {
      initials += parts[i][0]
    }
  }
  return initials
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const updateService = async (data: any, url: string) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify(data)

  const requestOptions: RequestInit | undefined = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => reject(error))
  })
}

export const createService = async (data: any, url: string) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify(data)

  const requestOptions: RequestInit | undefined = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => reject(error))
  })
}

export function slugify(str: string) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}
