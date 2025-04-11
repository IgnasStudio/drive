import "server-only"; // Ensure this file is only imported on the server side

import { int, bigint, text, singlestoreTable, index, singlestoreTableCreator } from "drizzle-orm/singlestore-core";
import { url } from "inspector";

export const createTable = singlestoreTableCreator((name) => `drive_${name}`);


export const files_table = createTable("files_table", {
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

export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = createTable("folders_table", {
  id: bigint("id", { mode: "number", unsigned: true}).primaryKey().autoincrement(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true}),
}, (tempTable) => {
  return [
    index("parent_index").on(tempTable.parent)
  ]
});

export type DB_FolderType = typeof folders_table.$inferSelect;