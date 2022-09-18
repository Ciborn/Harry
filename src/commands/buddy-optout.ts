import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { CommandInteraction } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import Command from "../structures/Command.js";

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

		if (s1.includes(userId)) {
			s1[s1.indexOf(userId)] = "";
		} else if (s3.includes(userId)) {
			s3[s3.indexOf(userId)] = "";
		} else {
			return interaction.reply({
				content: "Vous n'êtes pas inscrits au système de parrainage !",
				ephemeral: true
			});
		}

		interaction.reply({
			content: "Vous vous êtes désinscrits du système de parrainage !",
			ephemeral: true
		});

		const csvCouples = s1.map((s, i) => [s, s3[i]]);
		const csv = stringify(csvCouples, { delimiter: ";" });
		await writeFile("./cache/buddy.csv", csv);
	}
}
