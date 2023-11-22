import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import classNames from '../../utils/ClassNames'
import { StoreDataType } from '@/lib/service_types'
import { formatMoney } from '@/lib/utils'

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
        'flex flex-col py-6 px-4 lg:py-0 max-w-xs space-y-2',
      )}
    >
      <div className="bg-white/10 px-2">
        <select
          {...register('subject')}
          className="bg-transparent font-bold text-white p-3 focus:outline-none focus:shadow-outline-blue w-full"
        >
          <optgroup label="Subjects" className="bg-black">
            {subjects.map((subject, i) => (
              <option key={i} value={subject}>
                {subject}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="bg-white/10 px-2">
        <select
          {...register('level')}
          className="bg-transparent font-bold text-white mt-2 p-3 focus:outline-none focus:shadow-outline-blue w-full"
        >
          <optgroup className="bg-black" label="Academic Levels">
            {storedata.map((data) => (
              <option key={data.id} value={data.id}>
                {data.level}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="flex mt-2 sm:text-sm sm:leading-5 font-bold gap-2">
        <div className="bg-white/10 px-2 w-1/2">
          <select
            {...register('duration')}
            className="bg-transparent p-3 text-white focus:outline-none focus:shadow-outline-blue w-full"
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
        </div>

        <div className="bg-white/10 px-2 w-1/2 flex items-center justify-center">
          <div className="flex w-full mx-auto text-white relative bg-transparent rounded">
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
      </div>
      <div
        className={classNames(
          'font-bold text-white text-3xl mt-4 p-3 text-center bg-white/10',
        )}
      >
        $ {formatMoney(totalPrice)}
      </div>
    </div>
  )
}

export default PriceCalc
