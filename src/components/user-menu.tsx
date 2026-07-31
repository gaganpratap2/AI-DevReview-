"use client"

import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar";
import { LogOut , Settings , User , ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";


interface UserProps {
    id : string;
    name : string;
    email:string;
    image?: string | null | undefined
}

export function UserMenu({
    user} : {user:UserProps}
) {

    const router = useRouter();
    const handleSignOut = async() => {
        await signOut();
        router.push("/");
    };

    const initial = user.name ? user.name.split(" ").map((n) =>n[0]).join("").toUpperCase().slice(0,2) : (user.email[0].toUpperCase() ?? "U");


    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant={"ghost"} className="">
                    <Avatar>
                        <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} /> 
                    <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>
                    <span>{user.name ?? "User" }</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
                <div className="">
                    <div className="">
                          <Avatar>
                        <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} /> 
                    <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>

                        <div className="">
                            <span>{user.name ?? "User"}</span>
                             <span>{user.email ?? "Email"}</span>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

            <DropdownMenuItem className="">
                <User className="size-4"/>
                Profile
            </DropdownMenuItem>

             <DropdownMenuItem className="">
                <Settings className="size-4"/>
                Settings
            </DropdownMenuItem>

             <DropdownMenuItem className="">
                <User className="size-4"/>
                Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

             <DropdownMenuItem className="gap-2 py-2 cursor-pointer text-destructive" onClick={handleSignOut}>
                <LogOut className="size-4"/>
                Log Out
            </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}