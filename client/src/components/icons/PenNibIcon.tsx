import { IconType } from '@/components/icons'
import React from 'react'

const PenNibIcon = (props: IconType) => {
  return (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.2188 23.75C18.8583 23.75 20.1875 22.4208 20.1875 20.7812C20.1875 19.1417 18.8583 17.8125 17.2188 17.8125C15.5792 17.8125 14.25 19.1417 14.25 20.7812C14.25 22.4208 15.5792 23.75 17.2188 23.75Z"
        stroke={props.color || 'currentColor'}
        strokeWidth={props.strokeWidth || 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 33.25L15.1258 22.8743"
        stroke={props.color || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 33.25L25.457 29.8063C25.6614 29.7714 25.8529 29.6829 26.0119 29.55C26.171 29.417 26.292 29.2442 26.3625 29.0492L29.6875 20.1875L17.8125 8.3125L8.95078 11.6375C8.7555 11.7119 8.58298 11.8359 8.45023 11.9973C8.31748 12.1587 8.22908 12.3519 8.19375 12.5578L4.75 33.25Z"
        stroke={props.color || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.6875 20.1875L33.5914 16.2836C33.7036 16.1731 33.7927 16.0414 33.8535 15.8961C33.9143 15.7509 33.9457 15.595 33.9457 15.4375C33.9457 15.28 33.9143 15.1241 33.8535 14.9789C33.7927 14.8336 33.7036 14.7019 33.5914 14.5914L23.4086 4.40859C23.2981 4.29638 23.1664 4.20728 23.0211 4.14646C22.8759 4.08564 22.72 4.05432 22.5625 4.05432C22.405 4.05432 22.2491 4.08564 22.1039 4.14646C21.9586 4.20728 21.8269 4.29638 21.7164 4.40859L17.8125 8.31249"
        stroke={props.color || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PenNibIcon
