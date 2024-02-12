export interface RecommendationInterface {
    uid?: string,
    categories?: {id:string,value:string}[] | string[],
    profile?: string[],
    id?: string,
    timeStamp?: Date,
    location?: String,
    tag?: string,
    type?:string,
}
