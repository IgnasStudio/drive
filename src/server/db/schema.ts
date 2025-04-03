import { int, bigint, text, singlestoreTable, index, singlestoreTableCreator } from "drizzle-orm/singlestore-core";
import { url } from "inspector";

export const createTable = singlestoreTableCreator((name) => `drive_${name}`);


export const files = createTable("files_table", {
  id: bigint("id", { mode: "number", unsigned: true}).primaryKey().autoincrement(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(), 
  parent: bigint("parent", { mode: "number", unsigned: true}).notNull(),
}, (tempTable) => {
  return [
    index("parent_index").on(tempTable.parent)
  ]
});

export const folders = createTable("folders_table", {
  id: bigint("id", { mode: "number", unsigned: true}).primaryKey().autoincrement(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true}),
}, (tempTable) => {
  return [
    index("parent_index").on(tempTable.parent)
  ]
});