import fs from "node:fs"
import path from "node:path"
import { generateShortHash } from "./lib/generateShortHash"
import { loadTemplate } from "./utils/importTemplateFile"

/**
 * 新しい記事を作成する関数
 * @param {string} dirPath 保存先ディレクトリ
 */
function createArticle(dirPath: string): void {
  // ディレクトリが存在しない場合は作成する
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }

  const hash = generateShortHash()
  const fileName = `${hash}.md`
  const filePath = path.join(dirPath, fileName)

  // ファイルが既に存在する場合は再生成
  if (fs.existsSync(filePath)) {
    createArticle(dirPath)
    return
  }

  // テンプレートを読み込んでファイルを作成
  const content = loadTemplate()
  fs.writeFileSync(filePath, content)

  console.log(`🚀 Created new article: ${fileName}`)
}

const dirPath = process.argv[2]

if (dirPath) {
  createArticle(dirPath)
} else {
  console.log("Please specify the directory path.")
  process.exit(1)
}
