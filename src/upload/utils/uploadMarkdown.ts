import * as path from "node:path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import "dotenv/config"
import { getContentDate } from "../lib/getContentDate"
import { R2Client } from "../lib/r2Client"

/**
 * Markdownファイルを処理してR2に保存
 * @param {string} filePath ファイルパス
 */
export async function uploadMarkdown(filePath: string): Promise<void> {
  console.log(`Processing Markdown file: ${filePath}`)

  const articleData = getContentDate(filePath)

  // 保存先のキーを生成
  const r2Key = path.join(
    path.basename(path.dirname(filePath)),
    path.basename(filePath),
  )

  await R2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "",
      Key: r2Key,
      Body: JSON.stringify(articleData),
      ContentType: "application/json",
    }),
  )

  console.log(`🚀 Successfully processed and uploaded: ${articleData.slug}`)
}
