import * as crypto from "node:crypto"
import * as fs from "node:fs"
import * as path from "node:path"

const ARTICLE_DIR = "articles"
const TEMPLATE_PATH = path.join(__dirname, "template.md")

/**
 * 新しい記事を作成する関数
 */
function createArticle(): void {
  // articleディレクトリが存在しない場合は作成
  if (!fs.existsSync(ARTICLE_DIR)) {
    fs.mkdirSync(ARTICLE_DIR)
  }

  const hash = generateShortHash()
  const fileName = `${hash}.md`
  const filePath = path.join(ARTICLE_DIR, fileName)

  // ファイルが既に存在する場合は再生成
  if (fs.existsSync(filePath)) {
    createArticle()
    return
  }

  // テンプレートを読み込んでファイルを作成
  const content = loadTemplate()
  fs.writeFileSync(filePath, content)

  console.log(`🚀 Created new article: ${fileName}`)
}

createArticle()

/**
 * ランダムなハッシュ値を生成する関数
 * @returns {string} ハッシュ値
 */
function generateShortHash(): string {
  const timestamp = new Date().getTime().toString()
  return crypto
    .createHash("sha256")
    .update(timestamp)
    .digest("hex")
    .substring(0, 8)
}

/**
 * テンプレートファイルを読み込む関数
 * @returns {string} テンプレートファイルの内容
 */
function loadTemplate(): string {
  let template = fs.readFileSync(TEMPLATE_PATH, "utf-8")

  // テンプレート内の{{date}}を現在時刻に置換
  template = template.replace("{{date}}", new Date().toISOString())

  return template
}
