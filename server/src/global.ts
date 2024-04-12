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

export enum VideoStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  UPLOADING_TO_YOUTUBE = 'UPLOADING_TO_YOUTUBE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export type EmojiIcon = {
  id: number;
  name: string;
  emojiHandle: string;
  emojis: Emoji[];
};

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
  firstTime: boolean;
  isNewUser: boolean;
  timestamp: Date;
  videos?: Video[];
  comments?: Comment[];
  emojis?: Emoji[];
  hearts?: Heart[];
  certificates?: Certificate[];
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

export type Video = {
  id: number;
  timestamp: Date;
  status: VideoStatus;
  localPath?: string;
  youtubePath?: string;
  thumbnail?: string;
  filename?: string;
  user: User;
  userId: number;
  lesson?: Lesson;
};

export type Lesson = {
  id: number;
  timestamp: Date;
  lessonName: string;
  lessonNumber: number;
  partNumber?: number;
  trialAllowed: boolean;
  descriptionMD?: string;
  video?: Video;
  videoId: number;
  course: Course;
  courseId: number;
  comments?: Comment[];
  emojis?: Emoji[];
  hearts?: Heart[];
};

export type Certificate = {
  id: number;
  timestamp: Date;
  name: string;
  description?: string;
  image?: string;
  issuedAt?: Date;
  isPublic: boolean;
  user: User;
  userId: number;
  course: Course;
  courseId: number;
};

export type Course = {
  id: number;
  timestamp: Date;
  totalLesson: number;
  totalPart: number;
  courseName: string;
  totalDuration: bigint;
  knowledgeGained: string[];
  isPublic: boolean;
  descriptionMD?: string;
  lessons?: Lesson[];
  comments?: Comment[];
  emojis?: Emoji[];
  hearts?: Heart[];
  parts?: Part[];
  certificates?: Certificate[];
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
