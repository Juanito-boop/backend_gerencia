import { type JestConfigWithTsJest, createDefaultPreset } from "ts-jest";
/** @type {import('ts-jest').JestConfigWithTsJest} **/
const defaultPreset = createDefaultPreset();
const jestConfig: JestConfigWithTsJest = {
	...defaultPreset,
	transform: {
		...createDefaultPreset().transform,
	},
};
export default jestConfig;