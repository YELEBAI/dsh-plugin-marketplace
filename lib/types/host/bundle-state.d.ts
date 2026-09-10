/** Pure bundle-layer state transitions shared by profile persistence and tests. */
export declare function reconcileBundleName(currentBundles: readonly string[], packageName: string, beforeDependency: boolean, beforeDeclaresBundle: boolean, dependency: boolean, declaresBundle: boolean): string[];
export declare function toggleBundleName(currentBundles: readonly string[], packageName: string, enabled: boolean): string[];
