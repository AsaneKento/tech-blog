import fs from "node:fs"
import path from "node:path"

const TEMPLATE_PATH = path.join(__dirname, "template.md")

/**
 * テンプレートファイルを読み込む関数
 * @returns {string} テンプレートファイルの内容
 */
export function loadTemplate(): string {
  let template = fs.readFileSync(TEMPLATE_PATH, "utf-8")

  // テンプレート内の{{date}}を現在時刻に置換
  template = template.replace("{{date}}", new Date().toISOString())

  return template
}
