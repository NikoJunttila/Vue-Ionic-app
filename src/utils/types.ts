export interface Workouts {
    name : string;
    description : string;
    days : string;
    id : number;
    plans : SingleWorkout[];
    madeBy : string;
    sort: number
}
export interface SingleWorkout {
    notes? : string;
    date: any;
    aproxTime: number;
    day : string;
    exercises : dunno[];
}
export interface dunno {
    sets: number;
    reps: string;
    exercise: string;
    setsDone: number;
    done: boolean;
    weight?: number;
    editing:boolean;
}
export interface subWorkout {
    name: string;
    workout : dunno[];
}
export interface rlyDunno {
    id: number;
    workout : dunno[];
}
export interface EXERCISES {
    name : string;
    sets : number;
    reps : number;
    setsDone: number;
    done: boolean;
}

export interface quote {
    text? : string;
    author?: string;
    image?: string;
}
export interface guide {
    name: string;
    description : string;
    link : string;
}
export interface song{
        name: string,
        artist: string,
        genre: string,
        url: string
}
export interface UserProfile {
    accountType: string;
    displayName: string;
    displayName_lower: string;
    email: string;
    email_lower: string;
    photoURL: string;
}