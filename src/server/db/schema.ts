import { int, bigint, text, singlestoreTable, index, singlestoreTableCreator } from "drizzle-orm/singlestore-core";
import { url } from "inspector";

export const createTable = singlestoreTableCreator((name) => `drive_${name}`);


export const files = createTable("files_table", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(), 
  parent: int("parent").notNull(),
}, (tempTable) => {
  return [
    index("parent_index").on(tempTable.parent)
  ]
});

export const folders = createTable("folders_table", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  parent: int("parent"),
}, (tempTable) => {
  return [
    index("parent_index").on(tempTable.parent)
  ]
});