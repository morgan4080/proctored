import clsx from 'clsx'

export function Container({
  className,
  parentClassName,
  ...props
}: { className: string; parentClassName: string } & any) {
  return (
    <div className={clsx(parentClassName)}>
      <div
        className={clsx(
          'mx-auto w-full z-20 max-w-7xl px-4 sm:px-6 lg:px-8',
          className,
        )}
        {...props}
      />
    </div>
  )
}
