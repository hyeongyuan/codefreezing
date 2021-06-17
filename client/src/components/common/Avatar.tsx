import Image from 'next/image'

interface AvatarProps {
  imageUrl: string
  size: number
}

export default function Avatar({ imageUrl, size }: AvatarProps) {
  return (
    <>
      <Image className="avatar" src={imageUrl} width={size} height={size} />
      <style jsx global>{`
        .avatar {
          border-radius: 50%;
        }
      `}</style>
    </>
  )
}
