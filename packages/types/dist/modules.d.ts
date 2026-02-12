/**
 * Module System Types
 * Defines the structure for Payload shop modules (catalog, cart, checkout, accounts)
 */
import type { CollectionConfig } from 'payload';
/**
 * Module Definition
 * Each module exports both backend (Payload collections) and frontend (React components)
 */
export interface ModuleDefinition {
    /**
     * Unique module identifier (e.g., 'catalog', 'cart', 'checkout', 'accounts')
     */
    id: string;
    /**
     * Display name for the module
     */
    name: string;
    /**
     * Module description
     */
    description: string;
    /**
     * Module version (semver)
     */
    version: string;
    /**
     * Module dependencies (other module IDs)
     */
    dependencies?: string[];
    /**
     * Backend configuration
     */
    backend: {
        /**
         * Payload collections provided by this module
         */
        collections?: CollectionConfig[];
        /**
         * Payload globals provided by this module
         */
        globals?: any[];
        /**
         * API endpoints provided by this module
         */
        endpoints?: ModuleEndpoint[];
        /**
         * Database hooks/listeners
         */
        hooks?: ModuleHooks;
    };
    /**
     * Frontend configuration
     */
    frontend: {
        /**
         * React components exported by this module
         */
        components: {
            [componentName: string]: {
                path: string;
                description: string;
                props?: Record<string, any>;
            };
        };
        /**
         * Next.js pages provided by this module
         */
        pages?: {
            [pagePath: string]: {
                component: string;
                layout?: string;
            };
        };
        /**
         * Styling/theme configuration
         */
        styles?: {
            tailwind?: Record<string, any>;
            css?: string;
        };
    };
    /**
     * Configuration schema for the module
     */
    config?: {
        schema: Record<string, ConfigField>;
        defaults: Record<string, any>;
    };
}
export interface ModuleEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    handler: string;
    description?: string;
    auth?: boolean;
}
export interface ModuleHooks {
    beforeChange?: string[];
    afterChange?: string[];
    beforeRead?: string[];
    afterRead?: string[];
    beforeDelete?: string[];
    afterDelete?: string[];
}
export interface ConfigField {
    type: 'string' | 'number' | 'boolean' | 'select' | 'array' | 'object';
    label: string;
    description?: string;
    required?: boolean;
    defaultValue?: any;
    options?: Array<{
        label: string;
        value: string | number;
    }>;
    validation?: (value: any) => boolean | string;
}
/**
 * Module Registry
 * Tracks installed modules and their configuration
 */
export interface ModuleRegistry {
    modules: {
        [moduleId: string]: {
            definition: ModuleDefinition;
            config: Record<string, any>;
            enabled: boolean;
            installedAt: Date;
            updatedAt: Date;
        };
    };
}
/**
 * Tenant Configuration
 * Each tenant (customer) has their own module configuration
 */
export interface TenantConfig {
    id: string;
    name: string;
    domain?: string;
    modules: {
        [moduleId: string]: {
            enabled: boolean;
            config: Record<string, any>;
        };
    };
    theme?: {
        colors: Record<string, string>;
        fonts: Record<string, string>;
    };
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=modules.d.ts.map