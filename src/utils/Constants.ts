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

export const groups: Record<string, { name: string, roles: string[] }> = {
	"s1-td1": { name: "S1/S2 - TD1", roles: ["1132599322505117716", process.env.ROLE_ID_STUDENT] },
	"s1-td2": { name: "S1/S2 - TD2", roles: ["1132599408542883911", process.env.ROLE_ID_STUDENT] },
	"s1-td3": { name: "S1/S2 - TD3", roles: ["1132599515531190302", process.env.ROLE_ID_STUDENT] },
	"s1-td4": { name: "S1/S2 - TD4", roles: ["1132599566001258536", process.env.ROLE_ID_STUDENT] },
	"s3-td1": { name: "S3/S4 - TD1 (Data)", roles: ["1132599835669839923", process.env.ROLE_ID_STUDENT] },
	"s3-td2": { name: "S3/S4 - TD2 (Dév. C++)", roles: ["1132600095410495552", process.env.ROLE_ID_STUDENT] },
	"s3-td3": { name: "S3/S4 - TD3 (Dév. C++)", roles: ["1132600214063173753", process.env.ROLE_ID_STUDENT] },
	"s3-td4": { name: "S3/S4 - TD4 (Dév. C#)", roles: ["1132600273685188608", process.env.ROLE_ID_STUDENT] },
	"s5-td1": { name: "S5/S6 - TD1 (Data)", roles: ["1132601581322391674", process.env.ROLE_ID_STUDENT] },
	"s5-td2": { name: "S5/S6 - TD2 (Dév.)", roles: ["1132601802689355827", process.env.ROLE_ID_STUDENT] },
	"s5-td3": { name: "S5/S6 - TD3 (Dév.)", roles: ["1132601861858414662", process.env.ROLE_ID_STUDENT] },
	"alumni": { name: "Alumni", roles: [process.env.ROLE_ID_ALUMNI] },
	"guest": { name: "Invité", roles: [process.env.ROLE_ID_GUEST] },
	"teacher": { name: "Professeur", roles: [process.env.ROLE_ID_TEACHER] },
};
