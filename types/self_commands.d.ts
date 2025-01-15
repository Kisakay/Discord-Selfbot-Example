export interface SelfCommandType {
    name: string;
    description: string;

    options?: Option[];
    callback: Function;
}

export interface Option {
    name: string;
    description: string;
    type: number;
    required: boolean;
}

export enum OptionType {
    STRING = 1,
    INTEGER = 2,
    BOOLEAN = 3,
    USER = 4,
    CHANNEL = 5,
    ROLE = 6
}