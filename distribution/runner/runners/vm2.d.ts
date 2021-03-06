import { NodeVMOptions } from "vm2";
import { DangerContext } from "../../runner/Dangerfile";
import { DangerRunner } from "./runner";
import { DangerResults } from "../../dsl/DangerResults";
export declare function createDangerfileRuntimeEnvironment(dangerfileContext: DangerContext): Promise<NodeVMOptions>;
export declare const runDangerfileEnvironment: (filenames: string[], originalContents: (string | undefined)[], environment: any, injectedObjectToExport?: any) => Promise<DangerResults>;
declare const defaultExport: DangerRunner;
export default defaultExport;
