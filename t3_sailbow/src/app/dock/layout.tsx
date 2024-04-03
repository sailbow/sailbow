import { Navbar } from "../_components/nav-bar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen min-w-full flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Navbar />
            </header>
            <main className="grow">
                {children}
            </main>
        </div>
    )
}