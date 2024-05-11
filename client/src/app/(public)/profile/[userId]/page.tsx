import ProfileForm from '@/components/forms/profile-form'
import { userApiRequest } from '@/services/user.service'
import { cookies } from 'next/headers'

type Props = {
  params: { userId: string }
}

const ProfilePage = async ({ params }: Props) => {
  const { userId } = params
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload: profile } = await userApiRequest.get(
    Number(userId),
    accessToken
  )
  console.log('ProfilePage  profile:', profile)
  return (
    <div>
      <ProfileForm data={profile} />
    </div>
  )
}

export default ProfilePage
