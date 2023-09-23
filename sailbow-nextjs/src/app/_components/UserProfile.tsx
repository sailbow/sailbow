import { trpc } from "@/app/_trpc/client"

interface UserProfileProps {
  id: number
}
export default function UserProfile({ id }: UserProfileProps) {
    const { isSuccess, data} = trpc.getUserById.useQuery(id)
    return isSuccess && (
      <>
        <h1>{data.name}</h1>
        <h3>{data.email}</h3>
        <h3>{data.phone}</h3>
      </>
    )
}