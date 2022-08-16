import { CommandInteraction, SlashCommandBuilder, SlashCommandStringOption as Option } from "discord.js";
import { Arg, CommandMetadata } from "../utils/Constants";

function patchOption(option: Option, name: string, metadata: Arg) {
	try {
		return option.setName(name.toLowerCase())
			.setDescription(metadata.desc)
			.setRequired(!metadata.optional || false);
	} catch (err) {
		throw new TypeError(`There is an issue with the '${name}' command.\n${err}`);
	}
}

export default abstract class Command {
	public metadata: CommandMetadata;
	public name: string;
	
	constructor(name: string, metadata: CommandMetadata) {
		this.metadata = metadata;
		this.name = name;
	}

	abstract run(interaction: CommandInteraction): any;

	toSlashCommand() {
		const slash = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.metadata.description);

		if (this.metadata.args) {
			for (const [name, meta] of Object.entries(this.metadata.args)) {
				if (meta.as === "choice") {
					slash.addStringOption(o => patchOption(o, name, meta)
						.setChoices(...meta.choices));
				} else if (meta.as === "string") {
					slash.addStringOption(o => patchOption(o, name, meta));
				}
			}
		}
		
		return slash;
	}	
}
