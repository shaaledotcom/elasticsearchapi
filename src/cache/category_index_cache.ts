import { CategoryIndexInterface } from './category_index_interface';

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
class CategoryIndexCache {

    /**
     * The All items List.
     */
    public static categoryIndex:  CategoryIndexInterface [];

    public static currentPath:string;
}

export default CategoryIndexCache;