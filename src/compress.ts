import { groupBy, zip } from "@hiogawa/utils"
import fs from "node:fs"
import crypto from "node:crypto";

function main() {
  const rawCsv = fs.readFileSync("analyze.csv", "utf-8");
  const keys = rawCsv.trim().split("\n").map(line => line.split(",")[0]);
  const hashes = keys.map(hashStringToNumber);

  const hashGroups = groupBy(zip(keys, hashes), v => v[1]);
  for (const [k, g] of hashGroups) {
    if (g.length > 1) {
      console.log(k, g);
    }
  }

  // console.log(mapGroupBy(zip(keys, hashes), v => v[1], vs => [vs.length, vs.map(v => v[0])]))
  // check collision
  // console.log(hashes.length);
  // console.log(new Set(hashes).size);
  // console.log(hashes);

  // Uint32Array
  // new Map<number, [number, number]>
  // Uint32Array
  // BigUint64Array
}

// 48bits integer from sha256
function hashStringToNumber(s: string) {
  const buffer = crypto.createHash("sha512").update(s, "utf-8").digest();
  return parseInt(buffer.toString("hex").slice(0, 8), 16);
}

main();

// node -r esbuild-register ./src/compress.ts

// 188227
//
