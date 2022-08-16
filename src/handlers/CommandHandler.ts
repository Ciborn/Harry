import { CommandInteraction } from "discord.js";
import Command from "../structures/Command";

export default class CommandHandler {
	public commands: Map<string, Command> = new Map();

	execute(interaction: CommandInteraction) {
		if (this.commands.has(interaction.command.name)) {
			this.commands.get(interaction.command.name).run(interaction);
		}
	}

	register(...commands: (new () => Command)[]) {
		commands.forEach(Structure => {
			const command = new Structure();
			this.commands.set(command.name, command);
		});
	}
}
