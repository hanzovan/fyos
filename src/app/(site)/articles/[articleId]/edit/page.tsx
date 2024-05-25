import { authOptions } from "@/app/api/auth/authOptions";
import { ArticleEditing } from "@/components/ui/pages";
import { checkUserRole } from "@/lib/utils";
import { CustomSession } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface EditProps {
    params: {
        articleId: string;
    }
}

export default async function Edit({ params }: EditProps) {
    const session = await getServerSession(authOptions) as CustomSession | null;
    if (!session) {
        return redirect("/api/auth/signin?callbackUrl=/create-post")
    }
    const checkRole = checkUserRole(session?.user?.role);
    if (!checkRole.isAdminRole) {
        return redirect("/")
    }
    const articleId = params.articleId;
    return <ArticleEditing session={session} articleId={articleId} />;
}