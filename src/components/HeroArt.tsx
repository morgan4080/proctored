import clsx from 'clsx'
import Image from 'next/image'

const HeroArt = ({ className, ...props }: { className: string } & any) => {
  return (
    <Image
      className={clsx(className)}
      width={603}
      height={501}
      src="/hero.svg"
      alt="proctor owls hero"
    ></Image>
  )
}

export default HeroArt
