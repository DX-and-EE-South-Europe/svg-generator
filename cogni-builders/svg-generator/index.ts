import { BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { ConfigFile, Options } from "./options";

export default createBuilder<Options>((options, context) => {
    return new Promise<BuilderOutput>((resolve) => {
    });
});
