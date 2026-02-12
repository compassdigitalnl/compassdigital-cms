/**
 * Product Types
 * Enterprise-level product types with 63+ fields support
 */
/**
 * Product - Enterprise Template with 63+ fields
 * Supports B2C, B2B, and Hybrid pricing strategies
 */
export interface Product {
    id: string;
    sku: string;
    ean?: string;
    upc?: string;
    mpn?: string;
    name: string;
    slug: string;
    shortDescription?: string;
    description: string;
    brand?: string;
    manufacturer?: string;
    model?: string;
    categories: string[];
    tags?: string[];
    status: 'draft' | 'active' | 'archived' | 'out-of-stock';
    featured?: boolean;
    condition?: 'new' | 'refurbished' | 'used';
    warranty?: string;
    releaseDate?: Date;
    endOfLife?: Date;
    pricing: {
        basePrice: number;
        salePrice?: number;
        costPrice?: number;
        msrp?: number;
        taxClass?: string;
        taxRate?: number;
        includesTax?: boolean;
        rolePrices?: Array<{
            roleId: string;
            roleName: string;
            price: number;
            minQuantity?: number;
            maxQuantity?: number;
        }>;
        volumePricing?: Array<{
            minQuantity: number;
            maxQuantity?: number;
            price: number;
            discountPercentage?: number;
        }>;
        currency: string;
        alternativeCurrencies?: Array<{
            currency: string;
            price: number;
        }>;
    };
    inventory: {
        trackStock: boolean;
        stockQuantity?: number;
        lowStockThreshold?: number;
        backordersAllowed?: boolean;
        stockStatus: 'in-stock' | 'out-of-stock' | 'on-backorder' | 'discontinued';
        availabilityDate?: Date;
    };
    shipping: {
        weight?: number;
        weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
        dimensions?: {
            length: number;
            width: number;
            height: number;
            unit: 'cm' | 'm' | 'in' | 'ft';
        };
        shippingClass?: string;
        freeShipping?: boolean;
        handlingTime?: number;
    };
    media: {
        images: Array<{
            id: string;
            url: string;
            alt: string;
            position: number;
            thumbnail?: string;
        }>;
        videos?: Array<{
            id: string;
            url: string;
            thumbnail?: string;
            platform?: 'youtube' | 'vimeo' | 'custom';
        }>;
        documents?: Array<{
            id: string;
            url: string;
            title: string;
            type: 'manual' | 'datasheet' | 'certificate' | 'other';
        }>;
        featured_image?: string;
        gallery?: string[];
    };
    variants?: {
        hasVariants: boolean;
        variantType?: 'single' | 'matrix';
        attributes: Array<{
            name: string;
            slug: string;
            values: Array<{
                label: string;
                value: string;
            }>;
            visible?: boolean;
            variation?: boolean;
        }>;
        combinations: Array<{
            id: string;
            sku: string;
            attributes: Record<string, string>;
            price?: number;
            stockQuantity?: number;
            image?: string;
            enabled: boolean;
        }>;
    };
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        canonicalUrl?: string;
    };
    specifications?: Array<{
        group: string;
        attributes: Array<{
            name: string;
            value: string;
            unit?: string;
        }>;
    }>;
    b2b?: {
        minOrderQuantity?: number;
        maxOrderQuantity?: number;
        orderMultiple?: number;
        leadTime?: number;
        customizable?: boolean;
        quotationRequired?: boolean;
        contractPricing?: boolean;
    };
    related?: {
        crossSells?: string[];
        upSells?: string[];
        accessories?: string[];
        bundles?: Array<{
            id: string;
            products: string[];
            discount: number;
        }>;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    publishedAt?: Date;
    views?: number;
    sales?: number;
}
/**
 * Product Category
 */
export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parent?: string;
    image?: string;
    level: number;
    order: number;
    visible: boolean;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Product Collection/Group
 */
export interface ProductCollection {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    products: string[];
    rules?: {
        categories?: string[];
        tags?: string[];
        brands?: string[];
        priceRange?: {
            min?: number;
            max?: number;
        };
    };
    featured?: boolean;
    visible: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Product Review
 */
export interface ProductReview {
    id: string;
    productId: string;
    userId?: string;
    author: string;
    email?: string;
    rating: number;
    title?: string;
    content: string;
    verified?: boolean;
    helpful?: number;
    status: 'pending' | 'approved' | 'rejected' | 'spam';
    createdAt: Date;
    updatedAt: Date;
}
/**
 * CSV Import Mapping
 * Maps CSV columns to Product fields (63+ columns)
 */
export interface ProductImportMapping {
    templateType: 'basis' | 'advanced' | 'enterprise';
    columns: Array<{
        csvColumn: string;
        productField: string;
        transform?: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'array';
        required: boolean;
        defaultValue?: any;
    }>;
    options: {
        skipFirstRow: boolean;
        delimiter: ',' | ';' | '\t';
        encoding: 'utf-8' | 'latin1';
        updateExisting: boolean;
        createCategories: boolean;
        createBrands: boolean;
    };
}
//# sourceMappingURL=product.d.ts.map