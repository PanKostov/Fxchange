export interface FxHistoricalDataDto {

    success: boolean,
    timestamp: number,
    historical: boolean,
    base: string,
    date: string,
    rates: Record<string, number>;

}