import { Klass, LexicalNode } from "lexical";
import { YouTubeNode } from "./YouTubeNode";
import { AutoLinkNode, LinkNode } from "@lexical/link";

const MyNodes: Array<Klass<LexicalNode>> = [
    YouTubeNode,
    LinkNode as unknown as Klass<LexicalNode>,
    AutoLinkNode as unknown as Klass<LexicalNode>
];

export default MyNodes;