export interface IPost {
    type: "image" | "video" | "text";
    content: string;
    url?: string;
}
