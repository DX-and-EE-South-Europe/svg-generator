import { JsonObject } from "@angular-devkit/core";

export interface Options extends JsonObject {
  configFile: string;
}

export interface ConfigFile {
  inputDir: string;
  outputDir: string;
  prefix: string;
  modules: {
    name: string;
    files: string[];
  }[];
}