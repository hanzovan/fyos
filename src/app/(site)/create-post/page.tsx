import { authOptions } from "@/app/api/auth/authOptions";
import { CreatePostPage } from "@/components/ui/pages";
import { checkUserRole } from "@/lib/utils";
import { CustomSession } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions) as CustomSession | null;
    if (!session) {
        return redirect("/api/auth/signin?callbackUrl=/create-post")
    }
    const checkRole = checkUserRole(session?.user?.role);
    if (!checkRole.isAdminRole) {
        return redirect("/")
    }
    return <CreatePostPage session={session} />;
}