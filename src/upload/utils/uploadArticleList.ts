import * as fs from "node:fs"
import * as path from "node:path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { R2Client } from "../lib/r2Client"
import type { ArticleData } from "../types"
import "dotenv/config"
import { getContentDate } from "../lib/getContentDate"

/**
 * 全記事のリストをJSON形式でR2に保存
 */
export async function uploadArticleList(dirPath: string): Promise<void> {
  console.log("Updating Article list...")

  const markdownFilePaths = getAllMarkdownFiles(dirPath)

  const articles = createArticleList(markdownFilePaths)

  // 日付でソート（新しい順）
  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const fileName = path.basename(dirPath)

  // R2に記事リストをアップロード
  await R2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "",
      Key: `${fileName}.json`,
      Body: JSON.stringify(articles),
      ContentType: "application/json",
    }),
  )

  console.log("🚀 Update Article List!!")
}

/**
 * 指定ディレクトリ以下の全Markdownファイルのパスを取得
 * @param dirPath
 */
function getAllMarkdownFiles(dirPath: string): string[] {
  let results: string[] = []

  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat?.isDirectory()) {
      // ディレクトリの場合は再帰的に探索
      results = results.concat(getAllMarkdownFiles(filePath))
    } else if (filePath.endsWith(".md")) {
      // Markdownファイルの場合はリストに追加
      results.push(filePath)
    }
  }

  return results
}

/**
 * 記事のリストを作成する
 * @param filePaths
 * @returns {ArticleData[]} 記事のリスト
 */
function createArticleList(filePaths: string[]): ArticleData[] {
  const articles: ArticleData[] = []

  if (filePaths) {
    // 各記事のJSONファイルから必要な情報を抽出
    for (const filePath of filePaths) {
      const article = getContentDate(filePath)
      article.content = ""
      articles.push(article)
    }
  }

  return articles
}
