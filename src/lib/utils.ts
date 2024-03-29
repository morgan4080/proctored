import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Order, StoreDataType, Duration, optionType } from '@/lib/service_types'
import { addDays, differenceInHours } from 'date-fns'

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

export const updateRecord = async (data: any, url: string): Promise<any> => {
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

export const createRecord = async (data: any, url: string): Promise<any> => {
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

export const deleteRecord = async (_id: string, url: string): Promise<any> => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const requestOptions: RequestInit | undefined = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow',
  }

  const queryParams = new URLSearchParams()

  queryParams.set('id', _id)

  return new Promise((resolve, reject) => {
    fetch(url + '?' + queryParams.toString(), requestOptions)
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

export function formatMoney(money: string | number | null | undefined): string {
  if (!money) return '0'
  return `${parseFloat(`${money}`)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}.${
    parseFloat(`${money}`).toFixed(2).split('.')[1]
  }`
}

export function determineDuration(
  currentStoreData: StoreDataType,
  duration: {
    from: Date
    to: Date
  },
) {
  return Object.entries(currentStoreData.deadline).reduce(
    (acc, [key, value]) => {
      const getObj = () => {
        if (key.toLowerCase().includes('hour')) {
          return {
            [parseInt(key).toString()]: value,
          }
        } else {
          const futureDate = addDays(new Date(), parseInt(key))
          const currentDate = new Date()
          const newKey = differenceInHours(futureDate, currentDate)
          return {
            [newKey.toString()]: value,
          }
        }
      }
      const { from, to } = duration
      const difference = differenceInHours(to, from)
      console.log(difference, 'HOURS')
      if (difference >= parseInt(Object.keys(getObj())[0])) {
        acc = key
      }

      return acc
    },
    '',
  )
}

export function calculateOrderPrice(
  order: Order,
  storedata: StoreDataType[],
): number {
  const currentStoreData = storedata.find(
    (std: StoreDataType) => std.level === order.academic_level,
  )
  if (currentStoreData) {
    const currentDeadline = determineDuration(currentStoreData, {
      from: new Date(order.duration.from),
      to: new Date(order.duration.to),
    })

    return currentStoreData.deadline[currentDeadline]
  }
  return 0
}

export function generateReportOptions(ops: optionType[]) {
  const optionMap = new Map()

  // Iterate over the array and update the Map with the latest values
  for (const obj of ops) {
    const existingValue = optionMap.get(obj.option)
    if (!existingValue) {
      optionMap.set(obj.option, obj)
    } else {
      optionMap.set(existingValue.option, obj)
    }
  }

  // Convert the Map values back to an array

  return Array.from(optionMap.values())
}

type DataStructure<T> = {
  [key in keyof T]?: T[key] | undefined
}

export function generateKeyValuePairs<T>(data: DataStructure<T>) {
  return Object.entries(data).reduce(
    (accumulator: optionType[], currentValue) => {
      const [key, value] = currentValue
      if (value !== undefined) {
        // switch statement for price effectors
        accumulator.push({
          option: key,
          value: value ? value.toString() : (value as any),
        })
      }
      return accumulator
    },
    [],
  )
}
