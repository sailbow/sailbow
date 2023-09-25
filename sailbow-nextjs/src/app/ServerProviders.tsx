import TrpcProvider from './_trpc/TrpcProvider'
import { ClerkProvider } from '@clerk/nextjs'

export default function ServerProviders({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <TrpcProvider>
                {children}
            </TrpcProvider>
        </ClerkProvider>
    )
}