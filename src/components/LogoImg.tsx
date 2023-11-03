import { Comfortaa } from 'next/font/google'
import classNames from '../../libs/utils/ClassNames'

const comfortaa = Comfortaa({
  weight: ['700'],
  subsets: ['latin'],
})
export function LogoImg() {
  return (
    <div className="flex items-center justify-center">
      <h2
        className={classNames(
          comfortaa.className,
          'text-white text-lg leading-relaxed tracking-widest hidden lg:block',
        )}
      >
        <span className="text-black font-black">PROCTOR OWLS</span>
      </h2>
    </div>
  )
}
