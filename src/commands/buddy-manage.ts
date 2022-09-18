import { AttachmentBuilder, CommandInteraction } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
import Command from "../structures/Command.js";

const magicUtf8 = Buffer.from([0xef, 0xbb, 0xbf]); // let Excel know the CSV is UTF8-formatted

function exportCsv(couples: string[][], interaction: CommandInteraction) {
	const users = interaction.guild.members.cache;
	const userCouples = [];

	for (const [s1Id, s3Id] of couples) {
		const s1 = users.get(s1Id)?.displayName || "";
		const s3 = users.get(s3Id)?.displayName || "";
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
			const couples = [["", ""]]
			const csv = stringify(couples, { delimiter: ";" })
			await writeFile("./cache/buddy.csv", csv);

			return exportCsv(couples, interaction);
		});
	}
}
