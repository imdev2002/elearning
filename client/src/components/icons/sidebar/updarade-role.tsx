import { SVGProps } from 'react'

export function UpgradeRole(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        className="fill-default-400"
        fill="currentColor"
        d="M19 4h-4.18a3 3 0 0 0-5.64 0H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m-7 0a1 1 0 1 1-1 1a1 1 0 0 1 1-1m7 15H5v-4h14Zm0-6H5V9h14Z"
      ></path>
      <circle
        cx="17"
        cy="11"
        r="1"
        fill="currentColor"
        className="fill-default-400"
      ></circle>
      <circle
        cx="14"
        cy="11"
        r="1"
        fill="currentColor"
        className="fill-default-400"
      ></circle>
      <circle
        cx="14"
        cy="17"
        r="1"
        fill="currentColor"
        className="fill-default-400"
      ></circle>
      <circle
        cx="17"
        cy="17"
        r="1"
        fill="currentColor"
        className="fill-default-400"
      ></circle>
      <path
        fill="currentColor"
        d="M6 10h5v2H6zm0 6h5v2H6z"
        className="fill-default-400"
      ></path>
    </svg>
  )
}
