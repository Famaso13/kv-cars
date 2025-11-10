export interface LapsI {
    lap_id: number;
    driver_id: number;
    car_id: number;
    track_id: number;
    conditions_id?: number | null;
    lap_time_ms: number;
    date?: string;
    league_id?: number;
}
