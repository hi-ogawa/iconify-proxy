import fs from "node:fs";
import * as fleece from 'golden-fleece';
import { tinyassert } from "@hiogawa/utils"

async function main() {
  const baseDir = "node_modules/@iconify/json";
  const collectionsFile = `${baseDir}/collections.json`;
  const collections = JSON.parse(fs.readFileSync(collectionsFile, "utf-8"));
  for (const [k, v] of Object.entries(collections)) {
    const jsonFile = `${baseDir}/json/${k}.json`;
    const ranges = getIconRanges(jsonFile);
    console.log(ranges.map(String).join("\n"))
  }

  function getIconRanges(filepath: string) {
    const jsonRaw = fs.readFileSync(filepath, "utf-8");
    const json = JSON.parse(jsonRaw);
    const ast = fleece.parse(jsonRaw);
    tinyassert(ast.type === "ObjectExpression");

    const icons = ast.properties.find(p => p.key.type === "Literal" && p.key.value === "icons");
    tinyassert(icons);
    tinyassert(icons.value.type === "ObjectExpression");

    let result: [string, number, number][] = []
    for (const icon of icons.value.properties) {
      tinyassert(icon.key.type === "Literal");
      tinyassert(typeof icon.key.value === "string");
      const name = `${json.prefix}:${icon.key.value}`
      result.push([name, icon.value.start, icon.value.end])
    }
    return result;
  }
}

main();

// node --max-old-space-size=4000 -r esbuild-register ./src/analyze.ts |& tee test.csv

// jq 'to_entries | map([.key, .value.total, .value.palette, .value.height])' < node_modules/@iconify/json/collections.json

// jq 'to_entries | map([.key, .value.total]) | .sort_by(.[1])' < node_modules/@iconify/json/collections.json

// jq 'to_entries | .[] | select(.value.palette)' < node_modules/@iconify/json/collections.json

// jq 'to_entries | map(.value.total) | add' < node_modules/@iconify/json/collections.json

// curl -H 'range: bytes=10-100' https://raw.githubusercontent.com/iconify/icon-sets/master/json/ri.json

// curl -H 'range: bytes=1000-2000' https://raw.githubusercontent.com/iconify/icon-sets/master/json/fluent-emoji.json
// curl -H 'range: bytes=1000-2000' https://raw.githubusercontent.com/iconify/icon-sets/24ab4a4152216be5068c110735f56e75b4183b8f/json/noto.json

// du -ah node_modules/@iconify/json/json | sort -h
