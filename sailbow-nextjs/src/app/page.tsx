import Image from "next/image"
import sailbowIcon from "./icon.svg"

export default function Home() {
  return (
    <main>
      <Image
        priority
        src={sailbowIcon}
        alt="Sailbow Icon"
      />
      <div>Sailbow</div>
    </main>
  )
}
