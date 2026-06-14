export type FruitType {
        img: string;
        radius: number;
        scaleFactor?: number;
        selectionProbability: number;
};
export type OpponentState {
    formattedCurrentFruit?: {
        x: number,
        y: number,
        label: string
    }
    timeSurvived: string
    //or should i merge it, use this somewhere
}