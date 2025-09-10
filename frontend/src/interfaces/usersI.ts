export interface UserI {
    user_id: number;
    username: string;
    email: string;
    password: string;
    date_created: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    country: string;
    admin: number;
}

export interface UserStatsI {
    best_lap: string;
    best_lap_track: string;
    most_used_car: string;
}
