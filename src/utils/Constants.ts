type BaseArg = { desc: string, optional?: boolean };
type Choice = { name: string, value: string };

export type AttachmentArg = BaseArg & { as: "attachment" };
export type StringArg = BaseArg & { as: "string" };
export type ChoiceArg = BaseArg & { as: "choice", choices: Choice[] };
export type Arg = AttachmentArg | StringArg | ChoiceArg;

export type CommandMetadata = {
	args?: { [key: string]: Arg }
	description: string
};
