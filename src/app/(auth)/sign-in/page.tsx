"use client"
import { FaGithub } from "react-icons/fa"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn.email({
            email,
            password,
        });

        if (res.error) {
            setError(res.error.message || "An error occurred");
            setLoading(false);
        } else {
            router.push("/repos");
        }
    };

    const handleGithubSignIn = async () => {
        setError("");
        setLoading(true);

        try {
            await signIn.social({
                provider: "github",
                callbackURL: "/repos",
            });
        } catch (err) {
            setError("Failed to sign in with GitHub");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Sign In</CardTitle>
                    <CardDescription>
                        Sign in with your GitHub or email account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGithubSignIn}
                        disabled={loading}
                        type="button"
                    >
                        <FaGithub className="mr-2 size-4" />
                        GitHub
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="*********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Loading..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="underline underline-offset-4">
                            Sign Up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}











// "use client"
// import {FaGithub} from "react-icons/fa"
// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { signIn } from "@/lib/auth-client"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card , CardContent , CardDescription, CardHeader , CardTitle} from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"

// export default function signInPage(){
//     const route = useRouter();
//     const [email , setEmail] = useState("");
//     const [password , setPassword] = useState("");
//     const [error , setError] = useState("");
//     const [loading , setLoading] = useState(false);

//     const handleEmailSignIn = async (e:React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         const res = await signIn.email({
//             email,
//             password,
//         });

//         if(res.error){
//             setError(res.error.message || "An error occured");
//             setLoading(false);
//         }else{
//             route.push("/repos");
//         }
//     };

//     const handleGithubSignIn = async() => {
//         setError("");
//         setLoading(true);

//         await signIn.social({
//             provider:"github",
//             callbackURL: "/repos",
//         });
//     };

//     return(
//         <div className="flex min-h-screen items-center justify-center p-4">
//             <Card className="w-full max-w-md">
//             <CardHeader className="text-center">
//                 <CardTitle className="text-2xl">Sign In</CardTitle> 
//                 <CardDescription className="">
//                     Sign in with your Githun and Email account;
//                 </CardDescription> 
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 <Button variant="outline" onClick={handleGithubSignIn} disabled={loading}>
//                     <FaGithub className="mr-2 size-4"/> 
//                 </Button>

//                 <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                         <Separator className="w-full"/>
//                     </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                     <span className="bg-card px-2 text-mute-foreground">or continue with email</span>
//                 </div>
//                 </div>

//                 <form onSubmit={handleEmailSignIn} className="space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="email">Email</Label>
//                         <Input 
//                             id="email"
//                             type="email"
//                             placeholder="name@exapmle.com"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             disabled={loading}
//                         />
//                     </div>

//                      <div className="space-y-2">
//                         <Label htmlFor="password">Password</Label>
//                         <Input 
//                             id="password"
//                             type="password"
//                             placeholder="*********"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             disabled={loading}
//                         />
//                     </div>

//                     {error && <p className="text-red-500">{error}</p>}

//                     <Button type="submit" className="w-full" disabled={loading}>
//                         {loading ? "Loading..." : "Sign In"}
//                     </Button>

//                 </form>

//                 <p className="">
//                     Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link>
//                 </p>


//             </CardContent>
//             </Card>
//         </div>
//     )
// }


