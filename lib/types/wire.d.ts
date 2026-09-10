/** Hand-written Typert wire artifacts for the `marketplace` Remote service.
 *  Mirrors the generator output shape (see dsh-host-plugin-inventory's
 *  lib/typert.host.js / lib/typert.remote-client.js): the host loader
 *  validates this manifest and the client remote mounts the contribution.
 *  Every parameter and result uses a strict zod-v4 codec; the schemas
 *  therefore carry the wire contract, not just the TypeScript types.
 */
import { z } from 'zod';
/** Host-face manifest registered by @deepseek-ai/dsh-typert-loader. */
export declare const TYPERT: {
    package: string;
    face: string;
    schemas: never[];
    invocations: {
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
        };
        implementation?: string;
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
    }[];
    model: {
        services: never[];
        events: never[];
        objects: never[];
    };
};
/** Client-side contribution mounted through ctx.remote.$mount(). */
export declare const TYPERT_REMOTE: {
    package: string;
    descriptors: {
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
        };
        implementation?: string;
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
    }[];
};
export default TYPERT_REMOTE;
