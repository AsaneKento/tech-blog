import "dotenv/config"
import { uploadMarkdown } from "./uploadMarkdown"

/**
 * 変更ファイルの処理
 */
async function uploadFiles(files: string[]): Promise<void> {
  for (const file of files) {
    if (!file) continue

    // Markdownファイルの処理
    if (file.endsWith(".md")) {
      await uploadMarkdown(file)
    }

    // TODO: 画像ファイルの処理
  }

  // TODO: 記事のリスト更新
  console.log(`🚀 Created new articles!!`)
}

/**
 * 処理の実行
 */
const files = process.argv.slice(2)
uploadFiles(files).catch((err) => {
  console.error("Error processing files:", err)
  process.exit(1)
})
