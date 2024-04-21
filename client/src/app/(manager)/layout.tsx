import SideBar from '@/components/layouts/Sidebar'

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <SideBar />
      <div className="flex-1 p-5 h-screen overflow-auto">
        <div className="bg-neutral-900 rounded-xl h-full">{children}</div>
      </div>
    </div>
  )
}

type HeaderManagerType = {
  title: string
  icon: JSX.Element
}
export const HeaderManager = ({ title, icon }: HeaderManagerType) => {
  return (
    <h1 className="text-primary font-bold px-3 py-2 border-b-1 border-neutral-800 flex items-center gap-2">
      {icon}
      {title}
    </h1>
  )
}
