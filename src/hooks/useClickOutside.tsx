import { RefObject, useEffect } from 'react'

export const useClickOutside = (
  // A reference to the specific component to detect outside clicks.
  ref: RefObject<HTMLElement | undefined | null>,
  // Function to call when an outside click is detected.
  callback: () => void,
  // Boolean to control adding/removing the event listener.
  addEventListener = true,
) => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      callback()
    }
  }

  useEffect(() => {
    if (addEventListener) {
      document.addEventListener('click', handleClick)
    }

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}