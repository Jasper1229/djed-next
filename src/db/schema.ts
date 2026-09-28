import { pgTable, uuid, varchar, timestamp, integer, index, uniqueIndex, foreignKey, primaryKey, unique, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const milestones = pgTable("milestones", {
	id: uuid().default(sql`uuidv7()`).primaryKey(),
	skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" } ),
	name: varchar({ length: 100 }).default("Milestone").notNull(),
	description: varchar({ length: 2000 }).default("").notNull(),
	targetSeconds: integer("target_seconds").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("milestones_skill_id_idx").using("btree", table.skillId.asc().nullsLast()),
]);

export const practiceSessions = pgTable("practice_sessions", {
	id: uuid().default(sql`uuidv7()`).primaryKey(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" } ),
	startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	uniqueIndex("practice_sessions_one_active_per_user_key").using("btree", table.userId.asc().nullsLast()).where(sql`(ended_at IS NULL)`),
	index("practice_sessions_skill_id_idx").using("btree", table.skillId.asc().nullsLast()),
	index("practice_sessions_user_id_started_at_idx").using("btree", table.userId.asc().nullsLast(), table.startedAt.desc().nullsFirst()),
check("practice_sessions_end_after_start_chk", sql`((ended_at IS NULL) OR (ended_at > started_at))`),]);

export const skills = pgTable("skills", {
	id: uuid().default(sql`uuidv7()`).primaryKey(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	parentId: uuid("parent_id"),
	rootId: uuid("root_id").notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 2000 }).default("").notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	ownSeconds: integer("own_seconds").default(0).notNull(),
	totalSeconds: integer("total_seconds").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.parentId],
		foreignColumns: [table.id],
		name: "skills_parent_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.rootId],
		foreignColumns: [table.id],
		name: "skills_root_id_fkey"
	}).onDelete("cascade"),
	index("skills_parent_id_idx").using("btree", table.parentId.asc().nullsLast()),
	index("skills_root_id_idx").using("btree", table.rootId.asc().nullsLast()),
	index("skills_user_id_idx").using("btree", table.userId.asc().nullsLast()),
]);

export const users = pgTable("users", {
	id: uuid().default(sql`uuidv7()`).primaryKey(),
	username: varchar({ length: 32 }).notNull(),
	displayName: varchar("display_name", { length: 64 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("users_username_key").on(table.username),]);
