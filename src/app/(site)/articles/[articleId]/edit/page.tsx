import { authOptions } from "@/app/api/auth/authOptions";
import { checkUserRole } from "@/lib/utils";
import { CustomSession } from "@/types";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { title } from "process";

interface EditProps {
    params: {
        articleId: string;
    }
}

export default async function Edit({ params }: EditProps) {
    const session = await getServerSession(authOptions) as CustomSession | null;
    if (!session) {
        return redirect(`/api/auth/signin?callbackUrl=/${params}/edit`)
    }
    const checkRole = checkUserRole(session?.user?.role);
    // const isAuthor = session?.user?.id === article
    if (!checkRole.isAdminRole) {
        return redirect("/")
    }
    return (
        <>
            <h1 className="bg-blend-color-dodge">{params.articleId}</h1>
        </>
    )
}