export interface TrackConditionI {
    conditions_id: number;
    track_id: number;
    time?: string | null;
    weather_id?: number | null;
    track_temperature?: number | null;
    tire_id?: number | null;
}
