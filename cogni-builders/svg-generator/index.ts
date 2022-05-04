const fs = require("fs");
const path = require("path");

import { BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { ConfigFile, Options } from "./options";

export default createBuilder<Options>((options, context) => {
  return new Promise<BuilderOutput>((resolve) => {
    // read the config file that is in indicated in the angular.json
    console.log("Reading config file");
    const configFile: ConfigFile = readJsonConfigFile(`${context.workspaceRoot}${path.sep}${options.configFile}`);

    // calculate the input and output full paths directory
    const fullInputPath = `${context.workspaceRoot}${path.sep}${configFile.inputDir}`;
    const fullOutputPath = `${context.workspaceRoot}${path.sep}${configFile.outputDir}`;

    console.log(`Reading svg files from: ${fullInputPath}`);

    // read the template files
    const componentTemplatePath = "node_modules/cogni-builders/svg-generator/templates/component.template";
    const componentTemplate = fs.readFileSync(`${context.workspaceRoot}${path.sep}${componentTemplatePath}`, "utf8");
    const moduleTemplatePath = "node_modules/cogni-builders/svg-generator/templates/module.template";
    const moduleTemplate = fs.readFileSync(`${context.workspaceRoot}${path.sep}${moduleTemplatePath}`, "utf8");

    // generate the angular svg components
    const files = [...new Set(configFile.modules.flatMap((m) => m.files))];
    files.forEach((file) => {
      console.log(`Generating ${file}.component.ts`);
      const svgFile = fs.readFileSync(`${fullInputPath}${path.sep}${file}.svg`, "utf8");
      const componentTemplateCopy = doComponentTemplateReplacements(componentTemplate, svgFile, configFile.prefix, file);
      fs.writeFileSync(`${fullOutputPath}${path.sep}${file}.component.ts`, componentTemplateCopy);
    });

    // generate the angular modules
    configFile.modules.forEach((module) => {
      console.log(`Generating ${toKebabCase(module.name)}.module.ts`);
      const moduleTemplateCopy = doModuleTemplateReplacements(moduleTemplate, module);
      fs.writeFileSync(`${fullOutputPath}${path.sep}${toKebabCase(module.name)}.module.ts`, moduleTemplateCopy);
    });

    resolve({ success: true });
  });
});

const toLowerCamelCase = (value: string): string => {
  const length = value.length;
  let returned = "";
  for (let i = 0; i < length; i++) {
    if (value.charAt(i) == "-") {
      returned += value.charAt(i + 1).toUpperCase();
      i++;
    } else {
      returned += value.charAt(i);
    }
  }
  return returned;
};

const toUpperCamelCase = (value: string) => {
  let temp: string = toLowerCamelCase(value);
  temp = temp.charAt(0).toUpperCase() + temp.slice(1);
  return temp;
};

const toKebabCase = (value: string): string => {
  const length = value.length;
  let returned = "";
  value = `${value.charAt(0).toLowerCase()}${value.slice(1, value.length)}`;
  for (let i = 0; i < length; i++) {
    if (value.charAt(i) === value.charAt(i).toUpperCase()) {
      returned += `-${value.charAt(i).toLocaleLowerCase()}`;
    } else {
      returned += value.charAt(i);
    }
  }
  return returned;
};

const readJsonConfigFile = (path: string): ConfigFile => {
  return JSON.parse(fs.readFileSync(path, "utf8"));
};

const doComponentTemplateReplacements = (componentTemplate: string, svgFile: string, prefix: string, file: string): string => {
  componentTemplate = componentTemplate.replace("<%=template%>", svgFile);
  componentTemplate = componentTemplate.replace("<%=selector%>", `${prefix}${toUpperCamelCase(file)}Svg`);
  componentTemplate = componentTemplate.replace("<%=component%>", `${toUpperCamelCase(file)}`);
  return componentTemplate;
};

const doModuleTemplateReplacements = (moduleTemplate: string, module: { name: string; files: string[] }): string => {
  moduleTemplate = moduleTemplate.replace("<%=name%>", module.name);
  module.files.forEach((file) => {
    moduleTemplate = moduleTemplate.replace(
      "<%=imports%>",
      `import {${toUpperCamelCase(file)}SvgComponent} from './${file}.component';\n<%=imports%>`
    );
    moduleTemplate = moduleTemplate.replace("<%=declarations%>", `${toUpperCamelCase(file)}SvgComponent,\n<%=declarations%>`);
    moduleTemplate = moduleTemplate.replace("<%=exports%>", `${toUpperCamelCase(file)}SvgComponent,\n<%=exports%>`);
  });
  moduleTemplate = moduleTemplate.replace("<%=imports%>", "");
  moduleTemplate = moduleTemplate.replace("<%=declarations%>", "");
  moduleTemplate = moduleTemplate.replace("<%=exports%>", "");
  return moduleTemplate;
};