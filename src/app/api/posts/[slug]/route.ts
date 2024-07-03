import { PostService } from "@/lib/services";
import { checkUserRole } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, res: NextResponse) {
  
  const slug = req.nextUrl.pathname.split("/").pop();

  if (!slug) {
    return NextResponse.json(
      { isError: true, message: "Slug is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    // get the user info
    const userEncoded = req.headers.get("user");

    if (!userEncoded) {
      return NextResponse.json({ isError: true, message: "User information is missing" }, { status: 401 });
    }

    const user = JSON.parse(Buffer.from(userEncoded, "base64").toString("utf-8"));

    // get the original post
    const post = await PostService.getPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { isError: true, message: "Post not found" },
        { status: 404 }
      )
    }

    // check if user is the author of the original post or admin, if not reject request
    const isAuthor = typeof post.data?.user !== "string" && user.id === post.data?.user.id;
    const checkRole = checkUserRole(user.role);
    const isAdmin = checkRole.isAdminRole;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { isError: true, message: "Not authorized" },
        { status: 403 }
      )
    }
    
    // if user is admin or author, continue the request
    const result = await PostService.updatePost(slug as string, body);
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

export async function DELETE(req: NextRequest, res: NextResponse) {
  const slug = req.nextUrl.pathname.split("/").pop();
  if (!slug) {
    return NextResponse.json(
      { isError: true, message: "Slug is required" },
      { status: 400 }
    )
  }
  try {
    // get user info
    const userEncoded = req.headers.get("user");
    if (!userEncoded) {
      return NextResponse.json({ isError: true, message: "User information is missing" }, { status: 401 });
    }

    const user = JSON.parse(Buffer.from(userEncoded, "base64").toString("utf-8"));

    // get the original post
    const post = await PostService.getPostBySlug(slug)
    if (!post) {
      return NextResponse.json(
        { isError: true, message: "Post not found" },
        { status: 404 }
      )
    }
    // check if user is author or admin
    const isAuthor = user.id === post.data?.user?.id;
    const checkRole = checkUserRole(user.role);
    const isAdmin = checkRole.isAdminRole;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { isError: true, message: "Not authorized" },
        { status: 403 }
      )
    }

    const result = await PostService.deletePost(slug as string);
    if (result.isError) {
      return NextResponse.json(result, { status: 400 });
    } else {
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { isError: true, message: error.message }, {status: 500 }
    )
  }
}
