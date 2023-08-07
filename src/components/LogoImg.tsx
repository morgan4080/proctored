import { Comfortaa } from 'next/font/google'
import classNames from '@/Utils/ClassNames'

const comfortaa = Comfortaa({
  weight: ['700'],
  subsets: ['latin'],
})
export function LogoImg() {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="text-white w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 250 250"
      >
        <path
          fill="currentColor"
          d="M67.88,229.69c-1.99-.99-3.72-2.25-4.23-4.58-.18-.85-.26-1.74-.26-2.6-.02-14.97-.01-29.94-.01-44.92,0-31.1,0-62.19,0-93.29,0-14.73,4.42-27.97,13.67-39.46,9.9-12.3,22.68-19.97,38.29-22.52,18.2-2.97,34.7,1.31,49.12,12.81,11.93,9.51,19.32,21.9,22.22,36.92,.8,4.13,1.16,8.3,1.16,12.51-.01,18.83,0,37.67,0,56.5,0,14.45-3.09,28.2-9.84,41-10.39,19.7-25.99,33.69-46.73,41.9-6.95,2.75-14.18,4.38-21.58,5.3-1.06,.13-2.12,.28-3.18,.42h-38.62Zm40.24-13.03c1.34-.13,2.69-.19,4.01-.39,7.89-1.19,15.36-3.72,22.4-7.45,16.35-8.66,28.13-21.55,35.25-38.63,3.33-7.99,5.27-16.33,5.44-25.01,.15-7.58,.09-15.17,.12-22.76,0-.3-.09-.6-.18-1.21-5.48,6.93-11.78,12.49-19.24,16.68-7.5,4.21-15.58,6.63-24.14,7.66,0,1.01,0,1.75,0,2.49,0,7.11,.09,14.23-.05,21.33-.06,3.16-.33,6.37-.93,9.47-2.87,14.82-10.12,27.11-21.75,36.79-.35,.29-.6,.69-.89,1.04-.11,.02-.23,.04-.34,.06,.03,.05,.07,.1,.1,.16,.07-.08,.14-.17,.21-.25Zm11.34-122.07c0-3.39,.05-6.77-.02-10.16-.04-1.75-.14-3.54-.5-5.24-2.83-13.41-17.01-20.97-29.67-15.64-7.55,3.17-12.1,9.04-13.17,17.21-.68,5.2,.02,10.4,1.36,15.48,6.55,24.75,31.05,41.12,57.14,36.29,13.96-2.59,24.81-10.01,32.69-21.75,4.41-6.57,6.95-13.89,7.8-21.73,.38-3.48,.53-7.03-.32-10.51-3.69-15.04-21.49-21.91-34.31-12.22-5.92,4.47-8.62,10.63-8.68,17.95-.06,7.04,0,14.09-.02,21.13,0,.8-.03,1.64-.25,2.4-.88,2.94-3.8,4.82-6.71,4.39-3.09-.45-5.29-2.99-5.31-6.21-.03-3.79,0-7.59,0-11.38Zm-43.47,122.47c2.43-.53,4.62-.92,6.77-1.49,19.77-5.29,36.32-23.43,36.68-47.84,.1-6.91,.02-13.82,.01-20.73,0-.46-.09-.92-.15-1.46-17.7-2.15-32.05-10.24-43.32-24.39v95.91Zm12.69-166.58c15.04-3.19,27.39,1.18,36.94,13.3,9.65-12.16,21.95-16.49,36.95-13.29-19.3-22.36-54.99-22.01-73.88-.01Z"
        />
        <path
          fill="currentColor"
          d="M103.78,83.94c-.04,3.18-2.97,5.95-6.24,5.91-3.32-.05-6.16-3.08-6.11-6.54,.04-3.13,3.05-5.93,6.29-5.89,3.42,.05,6.11,2.94,6.06,6.52Z"
        />
        <path
          fill="currentColor"
          d="M153.63,77.42c3.31,0,6.11,2.87,6.16,6.3,.04,3.2-3.03,6.17-6.34,6.12-3.3-.05-6-2.93-6.02-6.43-.02-3.18,2.89-6,6.19-6Z"
        />
      </svg>
      <h2
        className={classNames(
          comfortaa.className,
          'text-white text-lg leading-relaxed tracking-widest hidden lg:block',
        )}
      >
        PROCTOR<span className="text-black">OWLS</span>
      </h2>
    </div>
  )
}
