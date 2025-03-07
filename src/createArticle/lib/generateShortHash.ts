import crypto from "node:crypto"

/**
 * ランダムなハッシュ値を生成する関数
 * @returns {string} ハッシュ値
 */
export function generateShortHash(): string {
  const timestamp = new Date().getTime().toString()
  return crypto
    .createHash("sha256")
    .update(timestamp)
    .digest("hex")
    .substring(0, 8)
}
