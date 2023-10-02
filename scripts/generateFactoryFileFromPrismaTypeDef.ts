import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

// アッパーキャメルケースをローワーキャメルケースに変換する
// モデル名はPrismaの命名規則に従ってアッパーキャメルケースの想定
export const toLowerCamelCase = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// node_modules 内に生成されている Prisma の型定義を見に行きます。
const typeDefs = fs.readFileSync(
  "./node_modules/.prisma/client/index.d.ts",
  "utf8"
);

// ts-node で実行した時に引数の一番後ろをモデル名と判定します。
const modelName = process.argv[process.argv.length - 1];

const outputDir = path.join("test", "factories");
const outputFilename = path.join(outputDir, `${toLowerCamelCase(modelName)}.ts`);
const sourceFile = ts.createSourceFile(
  outputFilename,
  typeDefs,
  ts.ScriptTarget.Latest
);

function main() {
  // 出力先のディレクトリを作成
  fs.mkdirSync(outputDir, { recursive: true });
  // まずは指定されたモデル名の型定義を抽出します
  let typeStr = "";
  function findTypeDef(node: ts.Node, sourceFile: ts.SourceFile) {
    if (ts.isModuleDeclaration(node) && node.name?.text === "Prisma") {
      node.body?.forEachChild((child) => {
        if (
          ts.isTypeAliasDeclaration(child) &&
          child.name?.escapedText === `${modelName}CreateInput`
        ) {
          typeStr = child.getText(sourceFile);
        }
      });
    }

    node.forEachChild((child) => {
      findTypeDef(child, sourceFile);
    });
  }
  findTypeDef(sourceFile, sourceFile);

  if (typeStr.length === 0) {
    console.error("該当のモデルが見つかりませんでした");
    return;
  }

  // 型定義が見つかったら、そこから プロパティ名: 型の文字列 のマップを作成します
  const typeMap = convertTypeStringToMap(typeStr);

  // 作成したマップを元に Factory 関数のファイルの文字列を作成します。
  const factoryFileString = generateFactoryFileString(typeMap);

  // できた文字列を書き込んだら完成です！
  fs.writeFileSync(outputFilename, factoryFileString, "utf-8");

  console.log(`生成に成功しました！${outputFilename} をご確認ください！！`);
}

main();

// プロパティ名: 型の文字列 なマップを作るための関数です。
// 結構ゴリ押しです。
type EntityMap = { key: string; type: string }[];
function convertTypeStringToMap(typeStr: string): EntityMap {
  const str = typeStr.split("=")[1].trim();
  const props = str.substring(1, str.length - 3);
  return props
    .split("\n")
    .map((keyValue: string) => ({
      key: keyValue.split(":")[0]?.trim().replace("?", ""),
      type: keyValue.split(":")[1]?.trim(),
    }))
    .filter((val) => val.key !== "__typename" && val.key !== "");
}

// 型定義の仕方によってどんなダミーデータを入れるかを指定する関数です。
// オリジナル作者様のコードを参考にfaker-jsを使うように修正
function dummyDataStringByType(typeStr: string) {
  switch (typeStr) {
    case "Date | string | null":
    case "Date | string":
    case "Date | null":
      return "faker.date.past()";
    case "string":
    case "string | null":
      return "faker.string.sample()";
    case "number":
    case "number | null":
      return "faker.number.int()";
    case "boolean":
    case "boolean | null":
      return "faker.datatype.boolean()";
    default:
      return "{}";
  }
}

// Factory ファイルの文字列を生成する関数です。
function generateFactoryFileString(typeMap: EntityMap) {
  const lowerCamelName = toLowerCamelCase(modelName);
  return `import { faker } from "@faker-js/faker";
import { Prisma, ${modelName}, PrismaClient } from "@prisma/client";

// 関連テーブルがある場合は親テーブル側のDefaultAttributesをimportして利用できます
export const ${lowerCamelName}DefaultAttributes: Prisma.${modelName}CreateInput = {
  ${typeMap
    .map((val) => `${val.key}: ${dummyDataStringByType(val.type)}`)
    .join(",\n  ")}
};

// こちらを参考にFactoryクラスを作成してください
// ある程度自由にカスタマイズして構いません
export class ${modelName}Factory {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(attributes: 
    Partial<Prisma.${modelName}CreateInput> = {}
  ): Promise<${modelName}> {
    return await this.prisma.${lowerCamelName}.create({
      data: {
        ...${lowerCamelName}DefaultAttributes,
        ...attributes,
      },
    });
  }

}
`;
}
