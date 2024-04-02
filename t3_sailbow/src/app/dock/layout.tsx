import { Navbar } from "../_components/nav-bar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}