export type ReqUser = {
  id: number
  email: string
  roles: UserRole[]
}

export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
}

export enum Platform {
  GOOGLE = 'GOOGLE',
  LOCAL = 'LOCAL',
}

export enum LessonStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  UPLOADING_TO_YOUTUBE = 'UPLOADING_TO_YOUTUBE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
}

export enum CourseCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  BUSINESS = 'BUSINESS',
  DESIGN = 'DESIGN',
  MARKETING = 'MARKETING',
  IT = 'IT',
  PERSONAL_DEVELOPMENT = 'PERSONAL_DEVELOPMENT',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  MUSIC = 'MUSIC',
  HEALTH = 'HEALTH',
  FITNESS = 'FITNESS',
  LIFESTYLE = 'LIFESTYLE',
  TEACHING = 'TEACHING',
  ACADEMICS = 'ACADEMICS',
  LANGUAGE = 'LANGUAGE',
  OTHER = 'OTHER',
}

export enum CoursedPaidStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export enum FormStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
}

export type User = {
  id: number
  email: string
  username?: string
  firstName?: string
  lastName?: string
  gender?: string
  password?: string
  salt?: string
  roles: UserRole[]
  phone?: string
  avatar?: string
  birthday?: Date | string
  isVerified: boolean
  verifyCode?: string
  platform: Platform
  refreshToken?: string
  firstTime: boolean
  isNewUser: boolean
  timestamp: Date
  comments: Comment[]
  emojis: Emoji[]
  hearts: Heart[]
  certificates: Certificate[]
  lessons: Lesson[]
  courses: Course[]
  coursedPaid: CoursedPaid[]
  submitForms: SubmitForm[]
  rating: Rating[]
  bookmarks: Bookmark[]
  syncWithGoogle: boolean
}

export type Role = {
  id: number
  name: RoleEnum
  description: string
  userRole: UserRole[]
}

export type UserRole = {
  id: number
  timestamp: Date
  role: Role
  roleId: number
  user: User
  userId: number
}

export type Lesson = {
  id: number
  timestamp: Date
  lessonName: string
  lessonNumber: number
  lessonType: LessonType
  trialAllowed: boolean
  descriptionMD?: string
  status: LessonStatus
  localPath?: string
  thumbnailPath?: string
  filename?: string
  course: Course
  courseId: number
  user: User
  userId: number
  comments: Comment[]
  emojis: Emoji[]
  hearts: Heart[]
  bookmarks: Bookmark[]
  part: Part
  partId: number
  duration: number
}

export type Certificate = {
  id: number
  timestamp: Date
  name: string
  description?: string
  issuedAt?: Date
  isPublic: boolean
  certificateNumber: bigint
  student: User
  studentId: number
  course: Course
  courseId: number
}

export type Course = {
  id: number
  timestamp: Date
  totalLesson: number
  totalPart: number
  courseName: string
  totalDuration: number
  knowledgeGained: string[]
  isPublic: boolean
  status: CourseStatus
  avgRating?: number
  thumbnail: string
  category: CourseCategory
  priceAmount: number
  currency: Currency
  priceId?: string
  productId?: string
  descriptionMD?: string
  user: User
  userId: number
  comments: Comment[]
  emojis: Emoji[]
  hearts: Heart[]
  parts: Part[]
  certificates: Certificate[]
  coursedPaid: CoursedPaid[]
  rating: Rating[]
  bookmarks: Bookmark[]
  Lesson: Lesson[]
}

export type CoursedPaid = {
  course: Course
  courseId: number
  user: User
  userId: number
  checkoutSessionId?: string
  status: CoursedPaidStatus
}

export type Part = {
  id: number
  timestamp: Date
  partNumber: number
  partName: string
  description?: string
  lessons: Lesson[]
  course: Course
  courseId: number
}

export type Comment = {
  id: number
  content: string
  timestamp: Date | string
  lesson?: Lesson
  lessonId?: number
  course?: Course
  courseId?: number
  user: User
  userId: number
  level: number
  parentId?: number
  parent?: Comment
  children?: Comment[]
}

export type Emoji = {
  id: number
  timestamp: Date
  emoji: EmojiIcon
  emojiId: number
  user: User
  userId: number
  lesson?: Lesson
  lessonId?: number
  course?: Course
  courseId?: number
}

export type EmojiIcon = {
  id: number
  name: string
  emojiHandle: string
  emojis: Emoji[]
}

export type Heart = {
  id: number
  user: User
  userId: number
  lesson?: Lesson
  lessonId?: number
  course?: Course
  courseId?: number
}

export type SubmitForm = {
  id: number
  timestamp: Date
  user: User
  userId: number
  real_firstName: string
  real_lastName: string
  selfie?: string
  frontIdCard?: string
  backIdCard?: string
  status: FormStatus
  category?: string
  linkCV?: string
}

export type Rating = {
  user: User
  userId: number
  course: Course
  courseId: number
  star: number
}

export type Bookmark = {
  id: number
  timestamp: Date
  user: User
  userId: number
  lesson?: Lesson
  lessonId?: number
  course?: Course
  courseId?: number
}
