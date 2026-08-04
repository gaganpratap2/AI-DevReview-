"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FolderGit2, GitPullRequest } from "lucide-react";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string |null | undefined;
}

interface HeaderProps {
  user: User;
}

const navItems = [
  {
    href: "/repos",
    label: "Repositories",
    icon: FolderGit2,
  },
  {
    href: "/reviews",
    label: "Reviews",
    icon: GitPullRequest,
  },
];

export function Header({ user }: HeaderProps) {
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              pathName === item.href ||
              pathName.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-slate-100 hover:text-slate-900",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
























// "use client"

// import Link from "next/link";
// import {usePathname} from "next/navigation";
// import { cn } from "@/lib/utils";
// import {FolderGit2 , GitPullRequest , Icon, ScanSearch } from "lucide-react"
// import { UserMenu } from "./user-menu";


// interface User {
//     id : string;
//     name: string;
//     email: string;
//     image?: string | null | undefined
// }

// interface HeaderProps {
//     user : User;
// }

// const navItems = [
//     {
//         href : "/repos",
//         label: "Repositories",
//         icon : FolderGit2
//     },
//     {
//         href: "/reviews",
//         label:"Reviews",
//         icon : GitPullRequest
//     },

// ];

// export function Header ({user} : HeaderProps){
//     const pathName = usePathname();

//     return <header>
//         <div className="">
//             <div className="">
//                 <nav>{navItems.map((item) => {
//                     const isActive = pathName === item.href || pathName.startsWith(`${item.href}/`);
//                     const Icon = item.icon;

//                     return(
//                         <Link key={item.href} href={item.href}>
//                             <Icon />
//                             {item.label}
//                         </Link>
//                     )
//                 })}</nav>
//             </div>

//                 <div className="">
//                     <UserMenu user={user}/>
//                 </div>


//         </div>
//     </header>
// }