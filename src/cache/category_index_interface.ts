export interface CategoryIndexInterface {
    id?: string;
    name?: string;
    level?: number;
    children?: CategoryIndexInterface[];
    parentId?: string;
    isContentPresent?: boolean;
    isVisible?: boolean;
    averageWeight?: number;
    hasAccess?: boolean;
    alias?: string[];
}
