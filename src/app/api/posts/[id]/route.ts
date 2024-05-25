import { PostService } from "@/lib/services";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, res: NextApiResponse) {
  
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { isError: true, message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const result = await PostService.updatePost(id as string, body);
    if (result.isError) {
      return NextResponse.json(result, { status: 400 });
    } else {
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { isError: true, message: error.message }, { status: 500 }
    )
  }
}
