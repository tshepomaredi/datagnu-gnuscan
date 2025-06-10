/* import { pgTable, serial, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

// Website table for storing website information to scan
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Scan results table
export const scanResults = pgTable("scan_results", {
  id: serial("id").primaryKey(),
  websiteId: serial("website_id").references(() => websites.id),
  isUp: boolean("is_up").notNull(),
  sslValid: boolean("ssl_valid"),
  sslExpiryDate: timestamp("ssl_expiry_date"),
  responseTime: integer("response_time"),
  scanDate: timestamp("scan_date").defaultNow().notNull(),
});

// User roles table
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(), // 'admin' or 'member'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
 */