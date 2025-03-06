import * as fs from "node:fs"
import * as path from "node:path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import matter from "gray-matter"
import "dotenv/config"
import { r2Client } from "./r2client"
import type { ArticleData } from "./types"

/**
 * Markdownファイルを処理してR2に保存
 * @param {string} filePath ファイルパス
 */
export async function uploadMarkdown(filePath: string): Promise<void> {
  console.log(`Processing Markdown file: ${filePath}`)

  // ファイル内容の読み取り
  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContent)
  const slug = path.basename(filePath, ".md")

  // 保存先のキーを生成
  const r2Key = path.join(
    path.basename(path.dirname(filePath)),
    path.basename(filePath),
  )

  const articleData: ArticleData = {
    slug: slug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    content: content,
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "",
      Key: r2Key,
      Body: JSON.stringify(articleData),
      ContentType: "application/json",
    }),
  )

  console.log(`🚀 Successfully processed and uploaded: ${slug}`)
}
