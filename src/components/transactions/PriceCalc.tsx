import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Inter, Lexend } from 'next/font/google'
import classNames from '../../utils/ClassNames'
type StoreDataType = {
  id: number
  level: string
  deadline: Record<string, number>
  format: string[]
  subjects0: string[]
  subjects: string[]
}

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const PriceCalc = (): JSX.Element => {
  const [storedata, setStoreData] = useState<StoreDataType[]>([])

  const [totalPrice, setTotalPrice] = useState<number>(0)

  const [deadlines, setDeadLines] = useState<any>({})

  const [subjects, setSubjects] = useState<any[]>([])

  const fetchData = async () => {
    const res = await fetch('/api/storedata')
    const json = await res.json()
    const data = JSON.parse(json)
    if (data) {
      setStoreData(data)
      return Promise.resolve(data)
    } else {
      return Promise.reject('data unavailable')
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<{
    level: number
    subject: string
    duration: string
    price: number
    pages: number
  }>({
    defaultValues: {
      level: 1,
      subject: 'Argumentative Essay',
      duration: '12 Hours',
      price: 20,
      pages: 1,
    },
  })

  useEffect(() => {
    fetchData()
      .then((data: StoreDataType[]) => {
        const filtered = data.find((el) => el.id === 1)
        const duration = filtered ? filtered.deadline : 0
        if (filtered) {
          setSubjects(filtered.subjects)
          setDeadLines(filtered.deadline)
        }
        setTotalPrice(Object.entries(duration)[0][1] * 1)
      })
      .catch((error) => console.warn(error))
  }, [])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log('watching', value, name)
      fetchData().then((data: StoreDataType[]) => {
        if (value && value.duration && value.level) {
          const academicLevel = data.find(
            (el) => el.id === parseInt(`${value.level}`),
          )

          if (academicLevel) {
            setValue('price', academicLevel.deadline[value.duration])
            setTotalPrice(
              academicLevel.deadline[value.duration] * getValues('pages'),
            )
          }
        }
      })
    })
    return () => subscription.unsubscribe()
  }, [getValues, setValue, watch])

  return (
    <div
      className={classNames(
        lexend.className,
        'flex flex-col py-6 lg:py-0 max-w-xs',
      )}
    >
      <select
        {...register('subject')}
        className="bg-transparent border-2 border-white font-bold text-white p-3 rounded shadow-sm focus:outline-none focus:shadow-outline-blue"
      >
        <optgroup label="Subjects" className="bg-black">
          {subjects.map((subject, i) => (
            <option key={i} value={subject}>
              {subject}
            </option>
          ))}
        </optgroup>
      </select>
      <select
        {...register('level')}
        className="bg-transparent border-2 border-white font-bold text-white mt-2 p-3 rounded shadow-sm focus:outline-none focus:shadow-outline-blue"
      >
        <optgroup className="bg-black" label="Academic Levels">
          {storedata.map((data) => (
            <option key={data.id} value={data.id}>
              {data.level}
            </option>
          ))}
        </optgroup>
      </select>
      <div className="flex mt-2 sm:text-sm sm:leading-5 font-bold ">
        <select
          {...register('duration')}
          className="w-1/2 bg-transparent border-2 border-white p-3 text-white  rounded shadow-sm focus:outline-none focus:shadow-outline-blue"
        >
          <optgroup label="Deadline">
            {Object.entries(deadlines).map((val, i) => {
              const [key, value] = val
              return (
                <option key={i} value={key}>
                  {key}
                </option>
              )
            })}
          </optgroup>
        </select>

        <div className="flex w-1/2 ml-1 text-white relative bg-transparent border-2 border-white rounded">
          <button
            className="w-1/3"
            onClick={() =>
              getValues('pages') > 0
                ? setValue('pages', getValues('pages') - 1)
                : setValue('pages', 0)
            }
          >
            -
          </button>
          <input
            {...register('pages')}
            className="w-1/3 bg-transparent text-center"
            type="number"
          />
          <button
            className="w-1/3"
            onClick={() => setValue('pages', getValues('pages') + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div
        className={classNames(
          'bg-transparent font-bold text-white text-5xl mt-4 p-3 text-center',
        )}
      >
        {totalPrice} $
      </div>
    </div>
  )
}

export default PriceCalc
