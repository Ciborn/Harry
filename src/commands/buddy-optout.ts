import arrayShuffle from "array-shuffle";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { CommandInteraction, GuildMember } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import Command from "../structures/Command.js";

const isS3 = (member: GuildMember) => member.roles.cache
	.some(r => r.name.includes("S3&4"));

function indexesOf<T extends any>(array: T[], element: T) {
	const indexes = [];
	let i = array.indexOf(element);
	while (i !== -1) {
		indexes.push(i);
		i = array.indexOf(element, i + 1);
	}
	return indexes;
}

export default class BuddyOptoutCommand extends Command {
	constructor() {
		super("buddy-optout", {
			description: "Désinscrivez-vous du système de parrainage"
		});
	}

	async run(interaction: CommandInteraction) {
		const userId = interaction.user.id;

		const file = await readFile("./cache/buddy.csv", { encoding: "utf-8" });
		const couples: string[][] = parse(file, { delimiter: ";" });

		const s1 = couples.map(c => c[0]);
		const s3 = couples.map(c => c[1]);

		if (!s1.includes(userId) && !s3.includes(userId)) {
			interaction.reply({
				content: "Vous vous êtes déjà désinscrits du système de parrainage !",
				ephemeral: true
			});
		} else {
			if (s1.includes(userId)) {
				const i = s1.indexOf(userId);
				s1.splice(i, 1);
				s3.splice(i, 1);
			} else if (s3.includes(userId)) {
				const indexes = indexesOf(s3, userId);

				let freeS3 = Array.from(interaction.guild.members.cache
					.filter(m => !s3.includes(m.id) && isS3(m)).keys());

				if (freeS3.length < indexes.length) {
					freeS3.push(...s3.filter(m => indexesOf(s3, m).length >= 2));
				}
				freeS3 = arrayShuffle(freeS3);

				for (let i = 0; i < indexes.length; i++) {
					const buddyId = s1[indexes[i]];
					s1.splice(indexes[i], 1);
					s3.splice(indexes[i], 1);
					s1.push(buddyId);
					s3.push(freeS3[i]);
				}
			}

			interaction.reply({
				content: "Vous vous êtes désinscrits du système de parrainage !",
				ephemeral: true
			});
		}

		const csvCouples = s1.map((s, i) => [s, s3[i]]);
		const csv = stringify(csvCouples, { delimiter: ";" });
		await writeFile("./cache/buddy.csv", csv);
	}
}
