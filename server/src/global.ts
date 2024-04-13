export type ReqUser = {
  id: number;
  email: string;
  roles: UserRole[];
};

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

export type EmojiIcon = {
  id: number;
  name: string;
  emojiHandle: string;
  emojis: Emoji[];
};
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
}

export type User = {
  id: number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  password?: string;
  salt?: string;
  roles: UserRole[];
  phone?: string;
  avatar?: string;
  birthday?: Date;
  platform: Platform;
  refreshToken?: string;
  isVerified: boolean;
  verifyCode?: string;
  firstTime: boolean;
  isNewUser: boolean;
  timestamp: Date;
  comments?: Comment[];
  emojis?: Emoji[];
  hearts?: Heart[];
  certificates?: Certificate[];
  lessons: Lesson[];
  course: Course[];
  coursedPaid: CoursedPaid[];
};

export type Role = {
  id: number;
  name: RoleEnum;
  description: string;
  userRole: UserRole[];
};

export type UserRole = {
  id: number;
  timestamp: Date;
  role: Role;
  roleId: number;
  user: User;
  userId: number;
};

export type Lesson = {
  id: number;
  timestamp: Date;
  lessonName: string;
  lessonNumber: number;
  partNumber?: number;
  trialAllowed: boolean;
  descriptionMD?: string;
  status: LessonStatus;
  localPath?: string;
  youtubePath?: string;
  thumbnailPath?: string;
  filename?: string;
  course: Course;
  courseId: number;
  comments?: Comment[];
  emojis?: Emoji[];
  hearts?: Heart[];
  user: User;
  userId: number;
};

export type Certificate = {
  id: number;
  timestamp: Date;
  name: string;
  description?: string;
  issuedAt?: Date;
  isPublic: boolean;
  certificateNumber: number;
  student: User;
  studentId: number;
  course: Course;
  courseId: number;
};

export type Course = {
  id: number;
  timestamp: Date;
  totalLesson: number;
  totalPart: number;
  courseName: string;
  totalDuration: number;
  knowledgeGained: string[];
  isPublic: boolean;
  status: CourseStatus;
  descriptionMD?: string;

  priceAmount: number;
  currency: Currency;
  priceId: string;
  productId: string;

  lessons?: Lesson[];
  comments?: Comment[];
  emojis?: Emoji[];
  hearts?: Heart[];
  parts?: Part[];
  certificates?: Certificate[];
  user: User;
  userId: number;

  coursedPaid: CoursedPaid[];
};

export type Part = {
  id: number;
  timestamp: Date;
  partNumber: number;
  partName: string;
  description?: string;
  course: Course;
  courseId: number;
};

export type Comment = {
  id: number;
  content: string;
  timestamp: Date;
  lesson?: Lesson;
  lessonId?: number;
  course?: Course;
  courseId?: number;
  user: User;
  userId: number;
  level: number;
  parentId?: number;
  parent?: Comment;
  children?: Comment[];
};

export type Emoji = {
  id: number;
  timestamp: Date;
  emoji: EmojiIcon;
  emojiId: number;
  user: User;
  userId: number;
  lesson?: Lesson;
  lessonId?: number;
  course?: Course;
  courseId?: number;
};

export type Heart = {
  id: number;
  user: User;
  userId: number;
  lesson?: Lesson;
  lessonId?: number;
  course?: Course;
  courseId?: number;
};
export type CoursedPaid = {
  course: Course;
  courseId: number;
  user: User;
  userId: number;
};
