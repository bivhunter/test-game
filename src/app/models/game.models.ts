export enum CellStatus {
    UNTOUCHED = 'UNTOUCHED',
    CORRECT = 'CORRECT',
    INCORRECT = 'INCORRECT',
    IN_PROCESS = 'IN_PROCESS',
}

export interface Cell {
    id: number,
    status: CellStatus,
}

export interface Score {
    user: number;
    computer: number;
}

