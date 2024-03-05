import os from 'os';
import path from 'path';
import util from 'util';
import fs from 'fs-extra';
import {
  log,
  spinner,
  confirm,
  isCancel,
  cancel,
  select,
} from '@clack/prompts';
import finder from 'find-package-json';
import simpleGit, { SimpleGit } from 'simple-git';
import { execSync, spawnSync } from 'child_process';
import { config } from '../config';

const stat = util.promisify(fs.stat);
const homeDir = os.homedir();
const currDir = process.cwd();

const getPackageJsonPath = (): string => {
  var f = finder(currDir);
  return f.next().filename || '';
};

const rootPackageJsonPath = getPackageJsonPath();
const projectRootPath: string = path.dirname(rootPackageJsonPath);

const getAllComponents = (): string[] => {
  const componentList = fs
    .readdirSync(path.join(homeDir, config.gluestackDir, config.componentsPath))
    .filter(
      (file) =>
        !['.tsx', '.ts', '.jsx', '.js'].includes(
          path.extname(file).toLowerCase()
        )
    );
  return componentList;
};

// const dashToPascal = (str: string): string => {
//   return str
//     .toLowerCase()
//     .replace(/-(.)/g, (_, group1) => group1.toUpperCase())
//     .replace(/(^|-)([a-z])/g, (_, _group1, group2) => group2.toUpperCase());
// };

const cloneRepositoryAtRoot = async () => {
  const clonedRepoExists = await checkIfFolderExists(
    path.join(homeDir, config.gluestackDir)
  );
  if (clonedRepoExists) {
    log.step('Repository already cloned.');
    await pullComponentRepo(path.join(homeDir, config.gluestackDir));
  } else {
    const s = spinner();
    s.start('Cloning repository...');
    await cloneComponentRepo(
      path.join(homeDir, config.gluestackDir),
      config.repoUrl
    );
    s.stop('Repository cloned successfully.');
  }
};

const cloneComponentRepo = async (
  targetPath: string,
  gitURL: string
): Promise<void> => {
  const git = simpleGit();
  const s = spinner();
  s.start('⏳ Cloning repository...');

  try {
    await git.clone(gitURL, targetPath, ['--branch', config.branchName]);
    s.stop('\x1b[32m' + 'Cloning successful.' + '\x1b[0m');
  } catch (err) {
    s.stop('\x1b[31m' + 'Cloning failed' + '\x1b[0m');
    log.error(`\x1b[31mError: ${(err as Error).message}\x1b[0m`);
  }
};

const pullComponentRepo = async (targetpath: string): Promise<void> => {
  const s = spinner();
  s.start('⏳ Pulling latest changes...');
  let retry = 0;
  let success = false;
  while (!success && retry < 3) {
    try {
      await wait(1000);
      await tryGitPull(targetpath);
      success = true;
    } catch (err) {
      log.error(`\x1b[31mError: ${(err as Error).message}\x1b[0m`);
      log.error(
        `\x1b[31mPulling failed - retrying... (Attempt ${retry + 1})\x1b[0m`
      );
      retry++;
    }
  }
  if (!success) s.stop('\x1b[31m' + 'Pulling failed!' + '\x1b[0m');
  else s.stop('\x1b[32m' + 'Git pull successful.' + '\x1b[0m');
};

const tryGitPull = async (targetPath: string): Promise<void> => {
  const git = simpleGit(targetPath);
  if (fs.existsSync(targetPath)) {
    await git.pull('origin', config.branchName);
  } else log.error('\x1b[31m' + 'Target path does not exist' + '\x1b[0m');
};

async function getLatestReleaseBranch() {
  try {
    const git: SimpleGit = simpleGit(path.join(homeDir, config.gluestackDir));
    await git.fetch(['--all']);
    const { all: remoteBranches } = await git.branch(['-r']);
    // Filter out release branches
    const releaseBranches = remoteBranches.filter((branch) =>
      /^origin\/release\/\d+\.\d+\.\d+$/.test(branch)
    );
    let latestReleaseBranch: string | null = null;
    let latestVersion: string | null = null;
    // Find the latest release branch
    releaseBranches.forEach((branch) => {
      const versionMatch = branch.match(/release\/(\d+\.\d+\.\d+)$/);
      if (versionMatch) {
        const version = versionMatch[1]; // Extracting the version from the capturing group
        if (!latestVersion || compareVersions(version, latestVersion) > 0) {
          latestVersion = version;
          latestReleaseBranch = branch;
        }
      }
    });
    return latestReleaseBranch;
  } catch (error) {
    log.error(`\x1b[31mError: ${(error as Error).message}\x1b[0m`);
    return null;
  }
}

function compareVersions(version1: string, version2: string): number {
  const parts1 = version1.split('.').map(Number);
  const parts2 = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) {
      return 1;
    } else if (part1 < part2) {
      return -1;
    }
  }

  return 0; // Versions are equal
}

const checkIfFolderExists = async (path: string): Promise<boolean> => {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
};

const wait = (msec: number): Promise<void> =>
  new Promise<void>((resolve, _) => {
    setTimeout(resolve, msec);
  });

const detectLockFile = (): string | null => {
  const packageLockPath = path.join(projectRootPath, 'package-lock.json');
  const yarnLockPath = path.join(projectRootPath, 'yarn.lock');
  const pnpmLockPath = path.join(projectRootPath, 'pnpm-lock.yaml');

  if (fs.existsSync(packageLockPath)) {
    return 'npm';
  } else if (fs.existsSync(yarnLockPath)) {
    return 'yarn';
  } else if (fs.existsSync(pnpmLockPath)) {
    return 'pnpm';
  } else {
    return null;
  }
};

const promptVersionManager = async (): Promise<any> => {
  const packageManager = await select({
    message:
      'No lockfile detected. Please select a package manager to install dependencies:',
    options: [
      { value: 'npm', label: 'npm', hint: 'recommended' },
      { value: 'yarn', label: 'yarn' },
      { value: 'pnpm', label: 'pnpm' },
    ],
  });
  if (isCancel(packageManager)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return packageManager;
};

const addDependencies = async (dependenciesToAdd: string[]): Promise<void> => {
  const packageJsonPath = rootPackageJsonPath;
  try {
    // Read in the existing package.json file
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.dependencies = packageJson.dependencies || {};
    // Add each dependency in the provided format
    dependenciesToAdd.forEach((packageName) => {
      packageJson.dependencies[packageName] = 'latest';
    });
    // Write the updated package.json file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (err) {
    log.error(`\x1b[31mError: ${(err as Error).message}\x1b[0m`);
  }
};

const installPackages = async (
  installationMethod: string | undefined,
  dependencies: string[]
): Promise<void> => {
  let command;
  let installCommand;
  if (!installationMethod) {
    let versionManager: string | null = detectLockFile();
    if (!versionManager) {
      versionManager = await promptVersionManager();
    }
    switch (versionManager) {
      case 'npm':
        command = `npm install --legacy-peer-deps `;
        installCommand = 'npm i';
        break;
      case 'yarn':
        command = `yarn `;
        installCommand = 'yarn';
        break;
      case 'pnpm':
        command = `pnpm i --lockfile-only `;
        installCommand = 'pnpm i';
        break;
      default:
        throw new Error('Invalid package manager selected');
    }
  } else {
    switch (installationMethod) {
      case 'npm':
        command = `npm install --legacy-peer-deps`;
        installCommand = 'npm i';
        break;
      case 'yarn':
        command = `yarn `;
        installCommand = 'yarn';
        break;
      case 'pnpm':
        command = `pnpm i --lockfile-only`;
        installCommand = 'pnpm i';
        break;
      default:
        throw new Error('Invalid package manager selected');
    }
  }

  const s = spinner();
  s.start('⏳ Installing dependencies...');

  try {
    await addDependencies(dependencies);
    spawnSync(command, {
      cwd: projectRootPath,
      stdio: 'inherit',
      shell: true,
    });
    execSync(installCommand, {
      stdio: 'inherit',
    });
    s.stop(`\x1b[32mDependencies have been installed successfully.\x1b[0m`);
  } catch (err) {
    log.error(`\x1b[31mError: ${(err as Error).message}\x1b[0m`);
    log.error('\x1b[31mError installing dependencies:\x1b[0m');
    log.warning(` - Run \x1b[33m'${command}'\x1b[0m manually!`);
    throw new Error('Error installing dependencies.');
  }
};

async function replaceRelativeImportInFile(
  filePath: string,
  oldImportPath: string,
  newImportPath: string
) {
  try {
    let fileContent: string = fs.readFileSync(filePath, 'utf8');
    const modifiedContent: string = fileContent.replace(
      new RegExp(`import {.*} from ['"]${oldImportPath}['"];`, 'g'),
      `import { config } from '${newImportPath}';`
    );
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
  } catch (err) {
    log.error(`Error replacing import statement: ${err}`);
  }
}

// Function to copy file with checks
const generateSpecificFile = async (
  sourcePath: string,
  targetPath: string,
  fileName: string
): Promise<void> => {
  try {
    // Check if file exists at targetPath
    const exists = await fs.pathExists(targetPath);
    if (exists) {
      const ifConfirm = await confirm({
        message: `File ${fileName} already exists. Do you want to overwrite it? (yes/no): `,
      });
      if (ifConfirm) {
        await fs.copyFile(sourcePath, targetPath);
      } else {
        log.info(`Creating ${fileName} has been skipped...`);
        return;
      }
      // return;
    } else {
      // File does not exist, proceed with copying
      await fs.copyFile(sourcePath, targetPath);
    }
  } catch (err) {
    log.error(`\x1b[31mError: ${(err as Error).message}\x1b[0m`);
  }
};

export {
  cloneRepositoryAtRoot,
  pullComponentRepo,
  checkIfFolderExists,
  getAllComponents,
  generateSpecificFile,
  installPackages,
  replaceRelativeImportInFile,
};
