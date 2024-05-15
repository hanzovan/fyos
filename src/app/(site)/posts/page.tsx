import { authOptions } from "@/app/api/auth/authOptions";
import { ArticlePage } from "@/components/ui/pages/ArticlePage";
import { PostRequest } from "@/lib/requests";
import { CustomSession } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
    try {
        const session = await getServerSession(authOptions) as CustomSession | null;
        if (!session) {
            return redirect("/api/auth/signin?callbackUrl=/posts")
        }
        const posts = await PostRequest.getAllNodeAPIPosts(session?.accessToken)

        return <ArticlePage posts={posts} title="External Node API posts fetching" />
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}