import { AttachmentBuilder, CommandInteraction } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import arrayShuffle from "array-shuffle";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
import Command from "../structures/Command.js";

const magicUtf8 = Buffer.from([0xef, 0xbb, 0xbf]); // let Excel know the CSV is UTF8-formatted

function exportCsv(couples: string[][], interaction: CommandInteraction) {
	const users = interaction.guild.members.cache;
	const userCouples = [];

	for (const [s1Id, s3Id] of couples) {
		const s1 = users.get(s1Id).displayName;
		const s3 = users.get(s3Id).displayName;
		userCouples.push([s1, s3]);
	}

	const csvBuffer = Buffer.from(stringify(userCouples, { delimiter: ";" }));
	const buffer = Buffer.concat([magicUtf8, csvBuffer]);
	const attachment = new AttachmentBuilder(buffer, { name: "buddy.csv" });

	return interaction.reply({ files: [attachment], ephemeral: true });
}

export default class BuddyManageCommand extends Command {
	constructor() {
		super("buddy-manage", {
			description: "Gérez la liste des associations parrain-filleul"
		});
	}

	async run(interaction: CommandInteraction) {
		readFile("./cache/buddy.csv", { encoding: "utf-8" }).then(file => {
			const csv: string[][] = parse(file, { delimiter: ";" });
			return exportCsv(csv, interaction);
		}).catch(async () => {
			const s1Members = interaction.guild.members.cache
				.filter(m => m.roles.cache.some(r => r.name.includes("S1&2")));
			const s3Members = interaction.guild.members.cache
				.filter(m => m.roles.cache.some(r => r.name.includes("S3&4")));

			const s1 = arrayShuffle(Array.from(s1Members.keys()));
			const s3 = arrayShuffle(Array.from(s3Members.keys()));
			const couples = [];

			for (let i = 0; i < Math.min(s1.length, s3.length); i++) {
				couples.push([s1[i], s3[i]]);
			}

			if (s1.length > s3.length) {
				for (let i = s3.length; i < s1.length; i++) {
					couples.push([s1[i], s3[i]]);
				}
			}

			const csv = stringify(couples, { delimiter: ";" })
			await writeFile("./cache/buddy.csv", csv);

			return exportCsv(couples, interaction);
		});
	}
}
