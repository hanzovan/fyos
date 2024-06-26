import { authOptions } from "@/app/api/auth/authOptions";
import { ArticleEditing } from "@/components/ui/pages";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface EditProps {
    params: {
        articleSlug: string;
    }
}

export default async function Edit({ params }: EditProps) {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session) {
        return redirect("/api/auth/signin?callbackUrl=/create-post")
    }
    const articleSlug = params.articleSlug;
    return <ArticleEditing session={session} articleSlug={articleSlug} />;
}