export type FruitType = {
        img: string;
        radius: number;
        scaleFactor?: number;
        selectionProbability: number;
};
export type OpponentState = {
    formattedCurrentFruit?: {
        id: number,
        x: number,
        y: number,
        label: string
    }
    timeSurvived: string
    //or should i merge it, use this somewhere
}
export type MoveFruit = {
    id: number,
    x: number,
    y: number
}