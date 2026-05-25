import { BlogPostCategory } from "@repo/type-definitions/blog-post-categories";
import { useEffect, useState } from "react";

const useCategories = () => {
    const [categories, setCategories] = useState<Array<BlogPostCategory>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] =
        useState<string>("All categories");

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/request-categories");

                if (response.ok) {
                    const data = await response.json();

                    if (isMounted) {
                        let parsedCategories: Array<BlogPostCategory> = [];

                        if (Array.isArray(data)) {
                            parsedCategories = data;
                        }

                        if (data.data) {
                            if (Array.isArray(data.data)) {
                                parsedCategories = data.data;
                            }
                        }

                        setCategories(parsedCategories);
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    return { categories, loading, selectedCategory, setSelectedCategory };
};

export default useCategories;
