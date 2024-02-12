export interface HomeSliderData {
    id?: string | null;
    buttonLink?: string | null;
    buttonText?: string | null;
    caption?: string | null;
    title?: string | null;
    image?: string | any;
    thumbnail?: { fileName: string, url: string };
    video?: string | null;
    index?: string;
}
