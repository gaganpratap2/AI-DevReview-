export default async function DashboardLayout({
    children,
} : {
    children : React.ReactNode;
}) {
    return (
        <div className="">
            <h1>Dashboard</h1>
            {children}
        </div>
    )
}