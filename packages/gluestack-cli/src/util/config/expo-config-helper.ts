import * as path from 'path';
import fg from 'fast-glob';
import * as fs from 'fs';
import { config } from '../../config';
import { generateConfig, getFilePath } from '.';
import {
  RawConfig,
  PROJECT_SHARED_IGNORE,
  ExpoResolvedConfig,
} from './config-types';

const _currDir = process.cwd();

// expo project type initialization
async function getExpoProjectType(cwd: string): Promise<string | undefined> {
  const files = await fg.glob('**/*', {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  });

  const isExpoProject = files.find(
    (file) =>
      file.startsWith('app.json') ||
      file.startsWith('app.config.js') ||
      file.startsWith('app.config.ts')
  );
  if (!isExpoProject) {
    return undefined;
  }

  const expoLayoutPath = fs.existsSync('app')
    ? 'app/_layout.*'
    : fs.existsSync('src/app')
      ? 'src/app/_layout.*'
      : '**/*_layout.*';

  const isUsingExpoRouter = await getFilePath([expoLayoutPath]);
  const isUsingDefaultExpo = await getFilePath(['App.*']);
  return isUsingExpoRouter
    ? 'expo-router'
    : isUsingDefaultExpo
      ? 'expo-default'
      : undefined;
}

async function isExpoSDK50(cwd: string): Promise<boolean> {
  //if expo project, check if expo version is greater than 50.0.0  by checking expo version in package.json file
  const packageJsonPath = path.join(_currDir, 'package.json');
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  const expoVersion = packageJson.dependencies.expo;

  const version = expoVersion.replace('^', '').replace('~', '');
  const versionArray = version.split('.');
  const majorVersion = parseInt(versionArray[0]);

  if (majorVersion < 50) {
    return false;
  }
  return true;
}
async function resolvedExpoPaths(resultConfig: ExpoResolvedConfig) {
  const resolvedExpoPaths = {
    tailwind: {
      config: path.resolve(_currDir, resultConfig.tailwind.config),
      css: path.resolve(_currDir, resultConfig.tailwind.css),
    },
    config: {
      babelConfig: path.resolve(
        _currDir,
        resultConfig.config.babelConfig || ''
      ),
      metroConfig: path.resolve(
        _currDir,
        resultConfig.config.metroConfig || ''
      ),
      tsConfig: path.resolve(_currDir, resultConfig.config.tsConfig || ''),
    },
    app: {
      entry: path.resolve(_currDir, resultConfig.app.entry || ''),
      type: resultConfig?.app?.type,
      sdk50: resultConfig?.app?.sdk50,
    },
  };
  return resolvedExpoPaths;
}

async function generateConfigExpoApp(): Promise<ExpoResolvedConfig> {
  const projectType = await getExpoProjectType(_currDir);
  const entryPath = await getFilePath(['**/*_layout.*', '**/*App.*']);
  const globalCssPath = await getFilePath([
    '**/*globals.css',
    '**/*global.css',
  ]);
  const tailwindConfigPath = await getFilePath(['tailwind.config.*']);
  const BabelConfigPath = await getFilePath(['babel.config.*']);
  const MetroConfigPath = await getFilePath(['metro.config.*']);
  const tsConfigPath = await getFilePath(['tsconfig.*']);
  const gluestackConfig: RawConfig = {
    tailwind: {
      config: tailwindConfigPath.length
        ? tailwindConfigPath
        : 'tailwind.config.js',
      css: globalCssPath.length ? globalCssPath : 'global.css',
    },
    app: {
      entry: entryPath,
      // write a function to get current components path
      components: config.writableComponentsPath,
    },
  };
  const resolvedGluestackConfig = {
    tailwind: {
      config: tailwindConfigPath.length
        ? tailwindConfigPath
        : 'tailwind.config.js',
      css: globalCssPath.length ? globalCssPath : 'global.css',
    },
    config: {
      babelConfig: BabelConfigPath.length ? BabelConfigPath : 'babel.config.js',
      metroConfig: MetroConfigPath.length ? MetroConfigPath : 'metro.config.js',
      tsConfig: tsConfigPath.length ? tsConfigPath : 'tsconfig.json',
    },
    app: {
      entry: entryPath,
      type: projectType,
      sdk50: await isExpoSDK50(_currDir),
    },
  };
  generateConfig(gluestackConfig);
  return await resolvedExpoPaths(resolvedGluestackConfig);
}

export { generateConfigExpoApp };
