/**
 * Controlled process restart for the DSH host.
 *
 * A detached helper waits for the current PID to disappear before it starts
 * the exact same Node invocation. This avoids racing the replacement process
 * against the old web server while it is still releasing its listening port.
 */
export interface RestartTarget {
    parentPid: number;
    executable: string;
    args: string[];
    cwd: string;
    env: NodeJS.ProcessEnv;
}
/** Capture the current executable and every Node/program argument verbatim. */
export declare function currentRestartTarget(): RestartTarget;
/** Start the detached waiter and resolve only once the helper itself exists. */
export declare function launchRestartHelper(target: RestartTarget): Promise<void>;
/**
 * Arm the replacement process, then enter DSH's normal SIGTERM shutdown path
 * after the Remote response has had time to reach the browser.
 */
export declare function scheduleProcessRestart(shutdownDelayMs?: number): Promise<void>;
