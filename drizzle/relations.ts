import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	milestones: {
		skill: r.one.skills({
			from: r.milestones.skillId,
			to: r.skills.id
		}),
	},
	skills: {
		milestones: r.many.milestones(),
		users: r.many.users({
			from: r.skills.id.through(r.practiceSessions.skillId),
			to: r.users.id.through(r.practiceSessions.userId),
			alias: "skills_id_users_id_via_practiceSessions"
		}),
		skillParentId: r.one.skills({
			from: r.skills.parentId,
			to: r.skills.id,
			alias: "skills_parentId_skills_id"
		}),
		skillsParentId: r.many.skills({
			alias: "skills_parentId_skills_id"
		}),
		skillRootId: r.one.skills({
			from: r.skills.rootId,
			to: r.skills.id,
			alias: "skills_rootId_skills_id"
		}),
		skillsRootId: r.many.skills({
			alias: "skills_rootId_skills_id"
		}),
		user: r.one.users({
			from: r.skills.userId,
			to: r.users.id,
			alias: "skills_userId_users_id"
		}),
	},
	users: {
		skillsViaPracticeSessions: r.many.skills({
			alias: "skills_id_users_id_via_practiceSessions"
		}),
		skillsUserId: r.many.skills({
			alias: "skills_userId_users_id"
		}),
	},
}))