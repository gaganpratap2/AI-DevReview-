"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";
import { cn } from "@/lib/utils";
import {FolderGit2 , GitPullRequest , Icon, ScanSearch } from "lucide-react"
import { UserMenu } from "./user-menu";


interface User {
    id : string;
    name: string;
    email: string;
    image?: string | null | undefined
}

interface HeaderProps {
    user : User;
}

const navItems = [
    {
        href : "/repos",
        label: "Repositories",
        icon : FolderGit2
    },
    {
        href: "/reviews",
        label:"Reviews",
        icon : GitPullRequest
    },

];

export function Header ({user} : HeaderProps){
    const pathName = usePathname();

    return <header>
        <div className="">
            <div className="">
                <nav>{navItems.map((item) => {
                    const isActive = pathName === item.href || pathName.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return(
                        <Link key={item.href} href={item.href}>
                            <Icon />
                            {item.label}
                        </Link>
                    )
                })}</nav>
            </div>

                <div className="">
                    {/** UserMenu has a non-React-returning type in its declaration; cast to a React component type for usage here. */}
                    {(() => {
                        const UserMenuComponent = UserMenu as unknown as React.ComponentType<any>;
                        return <UserMenuComponent user={user} />;
                    })()}
                </div>


        </div>
    </header>
}