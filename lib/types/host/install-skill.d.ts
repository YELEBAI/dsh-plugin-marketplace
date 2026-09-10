/** Load the packaged guided-install Skill for global DSH Agent discovery. */
export declare const INSTALL_SKILL_NAME = "install-dsh-plugin";
export interface MarketplaceSkillRegistration {
    name: string;
    description: string;
    source: 'runtime';
    provider: 'marketplace';
    path: string;
    resourceBase: {
        kind: 'directory';
        path: string;
    };
    invocation: {
        modelInvocable: true;
        userInvocable: true;
    };
    content: string;
}
/** Resolve both the TypeScript checkout and the built package layout. */
export declare function loadInstallSkill(): MarketplaceSkillRegistration;
