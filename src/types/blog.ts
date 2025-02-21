export type ContentType = "paragraph" | "emphasis" | "bullet" | "number"

export interface TextContent {
  type: "paragraph" | "emphasis"
  text: string
}

export interface ListContent {
  type: "bullet" | "number"
  items: string[]
}

export interface BlogSection {
  title: string
  content: (TextContent | ListContent)[] | string
}

export interface BlogPostData {
  date: string
  category: "CULTURE" | "ADVENTURE"
  title: string
  description: string
  imageUrl: string
  slug: string
  author: string
  
  readTime: string
  content: BlogSection[]
}

