import { CommandInteraction } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: { [k: string]: Command };
    }

    export interface Command {
        name: string;
        description: string;
        execute: (
            interaction: CommandInteraction,
            args: string[]
        ) => Promise<void>;
    }
}
