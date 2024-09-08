"use client";

import { IPost } from "@/types";
import { ArticleCard } from "../organisms";

interface SingleArticleProps {
  post: IPost;
}

const SingleArticlePage: React.FC<SingleArticleProps> = ({ post }) => {

  return <ArticleCard post={post} />
};

export { SingleArticlePage };
