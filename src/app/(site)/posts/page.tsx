import { authOptions } from "@/app/api/auth/authOptions";
import { ArticlePage } from "@/components/ui/pages";
import { PostRequest } from "@/lib/requests";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// custom error
class CustomError extends Error {
    constructor(message: string, public details?: any) {
        super(message);
        this.name = "CustomError";
    }
}

export default async function Home() {
    try {
        const session = await getServerSession(authOptions) as Session | null;
        if (!session) {
            return redirect("/api/auth/signin?callbackUrl=/posts")
        }
        const posts = await PostRequest.getAllNodeAPIPosts(session?.accessToken)

        return <ArticlePage posts={posts} title="External Node API posts fetching" />
    } catch (error) {

        if (error instanceof Error) {
            console.error("An error occurred:", error.message, error.stack);
            throw new CustomError(error.message, {stack: error.stack})
        } else {
            console.error("An unknown error occurred:", error);
            throw new CustomError("An unknown error occurred:", {error})
        }
        
        // throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}