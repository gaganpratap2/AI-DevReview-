"use client"

import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar";
import { LogOut , Settings , User , ChevronDown } from "lucide-react"


interface UserProps {
    id : string;
    name : string;
    email:string;
    image?: string | null | undefined
}

export function UserMenu({
    user} : {user:UserProps}
) {
    <div className="">menu</div>
}