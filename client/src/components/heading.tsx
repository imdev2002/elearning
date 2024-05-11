type Props = {
  title: string
  icon?: JSX.Element
}
export const Heading = ({ title, icon }: Props) => {
  return (
    <div className="relative h-fit w-fit">
      <h2 className=" font-bold py-2 flex items-center gap-2 text-2xl w-fit">
        {icon}
        {title}
      </h2>
      <div className="absolute bottom-0 h-1 w-2/3 bg-primary rounded-sm"></div>
    </div>
  )
}
