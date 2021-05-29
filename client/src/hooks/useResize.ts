import {useState, useEffect, MutableRefObject} from 'react';

const useResize = (docRef: MutableRefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(docRef.current?.offsetWidth ?? 0)
      setHeight(docRef.current?.offsetHeight ?? 0)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [docRef])

  return { width, height }
}

export default useResize