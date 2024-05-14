import { cn } from '@/lib/utils'

type Props = {
  title: string
  icon?: JSX.Element
  className?: string
}
export const Heading = ({ title, icon, className }: Props) => {
  return (
    <div className="relative h-fit w-fit">
      <h2
        className={cn(
          'font-bold py-2 flex items-center gap-2 text-2xl w-fit',
          className
        )}
      >
        {icon}
        {title}
      </h2>
      <div className="absolute bottom-0 h-1 w-2/3 bg-primary rounded-sm"></div>
    </div>
  )
}
