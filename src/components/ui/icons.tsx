import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Ban,
  Banknote,
  BookCheck,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CornerDownLeft,
  CreditCard,
  Edit,
  File,
  FileIcon,
  FileText,
  Heart,
  HeartOff,
  HelpCircle,
  Home,
  Image,
  Info,
  Laptop,
  Loader2,
  type LucideIcon,
  type LucideProps,
  Mail,
  Mic,
  Moon,
  MoreVertical,
  MoreVerticalIcon,
  Newspaper,
  Paperclip,
  Pin,
  PinOff,
  Pizza,
  Plus,
  Reply,
  RotateCw,
  Save,
  Settings,
  SmilePlus,
  SunMedium,
  Ticket,
  Trash,
  User,
  Users,
  X,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  activity: Activity,
  add: Plus,
  arrowRight: ArrowRight,
  banknote: Banknote,
  billing: CreditCard,
  braces: ({ ...props }: LucideProps) => (
    <svg
      width="40"
      height="40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="braces"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      {...props}
    >
      <path
        d="M20 15C20 12.5838 18.0412 10.625 15.625 10.625C13.125 10.625 12.3848 11.875 11.25 11.875C10.1152 11.875 9.375 10.625 6.875 10.625C4.45875 10.625 2.5 12.5838 2.5 15C2.5 20.625 5.625 29.375 7.5 29.375C8.62672 29.375 8.75 25.625 11.25 25.625C13.75 25.625 13.8733 29.375 15 29.375C16.875 29.375 20 20.625 20 15Z"
        stroke="#03045E"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M13.75 21.25H8.75V16.25H13.75V21.25Z"
        fill="#A2D2FF"
        stroke="#03045E"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M37.5 15C37.5 12.5838 35.5412 10.625 33.125 10.625C30.625 10.625 29.8848 11.875 28.75 11.875C27.6152 11.875 26.875 10.625 24.375 10.625C21.9587 10.625 20 12.5838 20 15C20 20.625 23.125 29.375 25 29.375C26.1267 29.375 26.25 25.625 28.75 25.625C31.25 25.625 31.3733 29.375 32.5 29.375C34.375 29.375 37.5 20.625 37.5 15Z"
        stroke="#03045E"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M31.25 21.25H26.25V16.25H31.25V21.25Z"
        fill="#A2D2FF"
        stroke="#03045E"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M13.75 18.75H26.25"
        stroke="#03045E"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M31.25 18.75H38.8281"
        stroke="#03045E"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M1.17188 18.75H8.75"
        stroke="#03045E"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
    </svg>
  ),
  dental: ({ ...props }) => (
    <svg
      width="40"
      height="40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="dental"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      {...props}
    >
      <g clip-path="url(#clip0_17001_1103)">
        <path
          d="M28.7522 17.0078C27.978 19.8531 26.2178 22.4039 24.9209 24.0016C23.9248 25.2289 23.3725 26.7578 23.3725 28.3383V36.1875C23.3725 37.5914 22.2772 38.7844 20.8741 38.8266C20.2303 38.8461 19.6295 38.6281 19.1623 38.2461C18.7139 37.8789 18.3889 37.3625 18.267 36.7609L17.2795 31.8734C16.8131 29.5711 13.5225 29.5711 13.0561 31.8734L12.0686 36.7609C11.8248 37.9633 10.7678 38.8281 9.54047 38.8281C8.82797 38.8281 8.18344 38.5399 7.71703 38.0734C7.25141 37.607 6.96313 36.9625 6.96313 36.25V28.343C6.96313 26.7594 6.40766 25.2289 5.40766 24.0016C2.93969 20.9734 -1.19469 14.5242 2.90844 9.13047C6.57484 4.31016 11.9116 6.37813 15.1678 8.41563C17.3186 7.06954 20.385 5.70469 23.2702 6.32657"
          stroke-miterlimit="10"
          stroke-linejoin="round"
        />
        <path
          d="M30.7811 17.2656C35.2253 17.2656 38.828 13.6629 38.828 9.21875C38.828 4.77458 35.2253 1.17188 30.7811 1.17188C26.3369 1.17188 22.7342 4.77458 22.7342 9.21875C22.7342 13.6629 26.3369 17.2656 30.7811 17.2656Z"
          stroke-miterlimit="10"
          stroke-linejoin="round"
        />
        <path
          d="M15.1678 8.41562C13.8819 9.27109 12.3827 10.5812 11.4842 12.2656"
          stroke-miterlimit="10"
          stroke-linejoin="round"
        />
        <path
          d="M30.7811 5.85938V9.21875H28.203"
          stroke-miterlimit="10"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_17001_1103">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  calendarCheck: CalendarCheck,
  cancel: Ban,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  edit: Edit,
  ellipsis: MoreVertical,
  email: Mail,
  enter: CornerDownLeft,
  file: FileIcon,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      />
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M473.16,221.48l-2.26-9.59H262.46v88.22H387c-12.93,61.4-72.93,93.72-121.94,93.72-35.66,0-73.25-15-98.13-39.11a140.08,140.08,0,0,1-41.8-98.88c0-37.16,16.7-74.33,41-98.78s61-38.13,97.49-38.13c41.79,0,71.74,22.19,82.94,32.31l62.69-62.36C390.86,72.72,340.34,32,261.6,32h0c-60.75,0-119,23.27-161.58,65.71C58,139.5,36.25,199.93,36.25,256S56.83,369.48,97.55,411.6C141.06,456.52,202.68,480,266.13,480c57.73,0,112.45-22.62,151.45-63.66,38.34-40.4,58.17-96.3,58.17-154.9C475.75,236.77,473.27,222.12,473.16,221.48Z"
      />
    </svg>
  ),
  heart: Heart,
  heartOff: HeartOff,
  help: HelpCircle,
  home: Home,
  info: Info,
  laptop: Laptop,
  logo: Command,
  media: Image,
  mic: Mic,
  moon: Moon,
  more: MoreVerticalIcon,
  newspaper: Newspaper,
  page: File,
  paperclip: Paperclip,
  pillBottle: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="pill-bottle"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" />
      <path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
      <rect width="16" height="5" x="4" y="2" rx="1" />
    </svg>
  ),
  pin: Pin,
  pizza: Pizza,
  post: FileText,
  publish: BookCheck,
  react: SmilePlus,
  reply: Reply,
  save: Save,
  settings: Settings,
  spinner: Loader2,
  sun: SunMedium,
  ticket: Ticket,
  trash: Trash,
  unpin: PinOff,
  update: RotateCw,
  user: User,
  users: Users,
  warning: AlertTriangle,
};
