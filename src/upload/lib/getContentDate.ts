import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import type { ArticleData } from "../types"

/**
 * Markdownのデータから必要なデータを取得する
 * @param {string} filePath
 * @returns {ArticleData} Markdownのデータ
 */
export function getContentDate(filePath: string): ArticleData {
  // ファイル内容の読み取り
  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContent)
  const slug = path.basename(filePath, ".md")

  return {
    slug: slug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    content: content,
  }
}
