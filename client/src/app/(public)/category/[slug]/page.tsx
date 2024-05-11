type Props = {
  params: {
    slug: string
  }
}

const CoursesByCategory = ({ params }: Props) => {
  const { slug } = params
  return <div>{slug}</div>
}

export default CoursesByCategory
