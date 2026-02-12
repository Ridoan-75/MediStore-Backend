export declare const categoryService: {
    createCategory: ({ name, description, imageUrl, }: {
        name: string;
        description?: string;
        imageUrl?: string;
    }) => Promise<{
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCategories: () => Promise<{
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getCategoryById: (categoryId: string) => Promise<{
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateCategory: (categoryId: string, data: {
        name?: string;
        description?: string;
        imageUrl?: string;
    }) => Promise<{
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCategory: (categoryId: string) => Promise<{
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map