// *****************************************************************************
// Copyright (C) 2020 TORO Limited and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { ConfirmDialog, Dialog, QuickInputService } from '@theia/core/lib/browser';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { SelectComponent } from '@theia/core/lib/browser/widgets/select-component';
import {
  Command, CommandContribution, CommandRegistry, MAIN_MENU_BAR,
  MenuContribution, MenuModelRegistry, MenuNode, MessageService, SubMenuOptions
} from '@theia/core/lib/common';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';
import * as React from '@theia/core/shared/react';
import { ReactNode } from '@theia/core/shared/react';

const InitGolangProject: Command = {
  id: 'init-golang-project',
  label: 'Init Go Project'
};


const MakeCommand: Command = {
  id: 'make-command',
  label: 'Make Command'
};

const InitProjectDirectory: Command = {
  id: 'init-project-directory',
  label: 'Init Project directory'
};

const GenerateYAMLFileCommand: Command = {
  id: 'generatre-yaml-file-command',
  label: 'Generate YAML File'
};

const DockerMenuCommand: Command = {
  id: 'docker-menu-command',
  label: 'Docker Command'
};

const BuildDockerfileCommand: Command = {
  id: 'build-dockerfile-command',
  label: 'Build Dockerfile Command'
};

const runDockerImgCommand: Command = {
  id: 'run-docker-img-command',
  label: 'Run Docker Image Command'
};

const RegistryPushImg: Command = {
  id: 'puah-container-image',
  label: 'Push Container Image'
};

// sub sub menu
const JavaCommand: Command = {
  id: 'java-command',
  label: 'Generate Java Dockerfile'
};

const PythonCommand: Command = {
  id: 'python-command',
  label: 'Generate Python Dockerfile'
};

const GolangCommand: Command = {
  id: 'golang-command',
  label: 'Generate Go Dockerfile'
};

const RunCommand: Command = {
  id: 'run-command',
  label: 'Run Command Menu'
};

const RunJavaCommand: Command = {
  id: 'run-java-command',
  label: 'Run Java'
};

const RunPython3Command: Command = {
  id: 'run-python3-command',
  label: 'Run Python3'
};

const RunGolangCommand: Command = {
  id: 'run-Golang-command',
  label: 'Run Golang'
}

const RegistryPullImg: Command = {
  id: 'pull-container-image',
  label: 'Pull Container Image'
};
const DockerLogin: Command = {
  id: 'docker-login',
  label: 'Docker Login'
};

const MLPipelineCreateRunFunc: Command = {
  id: 'ml-pipeline-create-run-func',
  label: 'ML Pipeline Create Run Func'
};


@injectable()
export class SampleCommandContribution implements CommandContribution {

  //export class SampleCommandContribution implements CommandContribution 내부에 위쪽
  @inject(QuickInputService)
  protected readonly quickInputService: QuickInputService;

  @inject(MessageService)
  protected readonly messageService: MessageService;
  @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;

  @inject(MonacoEditorProvider) protected readonly monacoEditorProvider: MonacoEditorProvider;

  @inject(FileService) protected readonly fileService: FileService;

  @inject(WindowService)
  protected readonly windowService: WindowService;
  protected doOpenExternalLink = (url: string) => this.windowService.openNewWindow(url, { external: true });

  @inject(TerminalService) protected readonly terminalService: TerminalService;
  @inject(FileDialogService) protected readonly fileDialogService: FileDialogService;
  @inject(RequestService) protected requestService: RequestService;
  @inject(FileDialogService) protected readonly fileDialogService2: FileDialogService;
  @inject(RequestService) protected requestService2: RequestService;


  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand({ id: 'create-quick-pick-sample', label: 'Internal QuickPick' }, {
      execute: () => {
        const pick = this.quickInputService.createQuickPick();
        pick.items = [{ label: '1' }, { label: '2' }, { label: '3' }];
        pick.onDidAccept(() => {
          console.log(`accepted: ${pick.selectedItems[0]?.label}`);
          pick.hide();
        });

        // 사용자가 선택한 Golang 실행 커멘드 메뉴
        commands.registerCommand(RunGolangCommand, {
          execute: async () => {
            await this.fileDialogService.showOpenDialog({
              title: RunPython3Command.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
            }).then((selectUri: URI | undefined) => {
              if (selectUri) {
                const currentTerminal = this.terminalService.currentTerminal;
                if (currentTerminal === undefined) {
                  alert('current terminal undefined!');
                  return;
                } else {
                  const fileFullPath = selectUri.toString();
                  const filePathElement = selectUri.toString().split('/');
                  const filename = filePathElement[filePathElement.length - 1];
                  const filePath = fileFullPath.replace(filename, '').replace('file://', '');

                  const runPythonCommandLine: CommandLineOptions = {
                    cwd: filePath,   // Command실행 경로
                    args: ['python3', filename],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                    env: {}
                  };
                  currentTerminal.executeCommand(runPythonCommandLine);
                }
              } else {
                alert('Not Select file!');
              }
            });
          }
        })
        // 사용자가 선택한 Python 실행 커멘드 메뉴
        commands.registerCommand(RunPython3Command, {
          execute: async () => {
            await this.fileDialogService.showOpenDialog({
              title: RunPython3Command.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
            }).then((selectUri: URI | undefined) => {
              if (selectUri) {
                const currentTerminal = this.terminalService.currentTerminal;
                if (currentTerminal === undefined) {
                  alert('current terminal undefined!');
                  return;
                } else {
                  const fileFullPath = selectUri.toString();
                  const filePathElement = selectUri.toString().split('/');
                  const filename = filePathElement[filePathElement.length - 1];
                  const filePath = fileFullPath.replace(filename, '').replace('file://', '');

                  const runPythonCommandLine: CommandLineOptions = {
                    cwd: filePath,   // Command실행 경로
                    args: ['python3', filename],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                    env: {}
                  };
                  currentTerminal.executeCommand(runPythonCommandLine);
                }
              } else {
                alert('Not Select file!');
              }
            });
          }
        });
            // 사용자가 선택한 Java 실행 커멘드 메뉴
        commands.registerCommand(RunJavaCommand, {
          execute: () => {
            this.fileDialogService.showOpenDialog({
              title: RunJavaCommand.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
            }).then((selectUri: URI | undefined) => {
              if (selectUri) {
                const currentTerminal = this.terminalService.currentTerminal;

                if (currentTerminal === undefined) {
                  alert('current terminal undefined!');
                  return;
                } else {
                  // let filePath = selectUri.toString().replace('file://', '');
                  const fileFullPath = selectUri.toString();
                  const filePathElement = selectUri.toString().split('/');
                  // alert('>>>'+ filePath[-1]);
                  const filename = filePathElement[filePathElement.length - 1];
                  const filePath = fileFullPath.replace(filename, '').replace('file://', '');

                  const runJavaCommandLine: CommandLineOptions = {
                    cwd: filePath,   // Command실행 경로
                    args: ['javac', filename],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                    env: {}
                  };
                  currentTerminal.executeCommand(runJavaCommandLine);
                  const runJavaCommandLine2: CommandLineOptions = {
                    cwd: filePath,   // Command실행 경로
                    args: ['java', filename.replace('.java', '')],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                    env: {}
                  };
                  currentTerminal.executeCommand(runJavaCommandLine2);
                }
              } else {
                const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
                const rootUri = firstRootUri.toString().replace('file://', '');

                if (result) {
                  const runCommandOption = result.split(' ');
                  if (runCommandOption.length >= 1) {
                    const runDockerImgToContainer: CommandLineOptions = {
                      cwd: rootUri,   // Command실행 경로
                      args: runCommandOption,
                      env: {}
                    };
                    currentTerminal.executeCommand(runDockerImgToContainer);
                  }
                } else {
                  return;
                }
              }
            }
        });
      }
    protected readJsonFile(fileUri: URI) {
        return this.fileService.read(fileUri);
      }
    });

  }

  // eslint-disable-next-line @typescript-eslint/tslint/config
  protected async createRunAPI(yamlStr: string, checkpointStr: boolean, nameStr: string, descriptionStr: string) {
    const bodyData = JSON.stringify({
      // name: value01,
      // describe: value02,
      // base64: btoa(value03)
      yaml: btoa(yamlStr),
      metadata: {
        checkpoint: checkpointStr,
        name: nameStr,
        description: descriptionStr
      }
    });

    console.log('Translate result: ' + JSON.stringify(bodyData));

    await fetch('http://hybrid.strato.co.kr:30121/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: bodyData
    }).then(response => {
      console.log('ok?: ', response.ok);
      if (!response.ok) {
        console.log('HTTP error', response.status);
        alert('The ML Workload Run Has Failed!');
      } else {
        console.log('HTTP Result: ', response.status, ' _ ', response.statusText);
        alert('ML Workload Has Run Successfully!');
      }
    });

    registerCommands(commands: CommandRegistry): void {
      commands.registerCommand({ id: 'create-quick-pick-sample', label: 'Internal QuickPick' }, {
        execute: () => {
          const pick = this.quickInputService.createQuickPick();
          pick.items = [{ label: '1' }, { label: '2' }, { label: '3' }];
          pick.onDidAccept(() => {
            console.log(`accepted: ${pick.selectedItems[0]?.label}`);
            pick.hide();
          });
          pick.show();
        }
      });

      //----------------------- Java를 실행을 위한 도커파일 예제 생성 메뉴
      commands.registerCommand(JavaCommand, {
        execute: () => {
          const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
          const rootUri = firstRootUri.toString().replace('file://', '');
          this.fileService.createFileKetiJava(new URI(rootUri + '/Dockerfile'));
        }
      });
	// Golang 실행을 위한 도커파일 예제 생성 메뉴
    commands.registerCommand(GolangCommand, {
      execute: () => {
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        this.fileService.createFileKetiGolang(new URI(rootUri + '/Dockerfile'));
      }
    });
	// 현재 열린 디렉토리에 go-lang 프로젝트 구조 생성
    commands.registerCommand(InitGolangProject, {
      execute: () => {
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        alert(rootUri);

        this.fileService.createFolder(new URI(rootUri + '/goProject'));
        this.fileService.createFolder(new URI(rootUri + '/goProject'));
        this.fileService.createFile(new URI(rootUri + '/goProject/Dockerfile'));
        this.fileService.createFolder(new URI(rootUri + '/goProject/pkg'));
        this.fileService.createFolder(new URI(rootUri + '/goProject/bin'));
        this.fileService.createFolder(new URI(rootUri + '/goProject/src'));
        this.fileService.createFile(new URI(rootUri + '/goProject/src/main.go'));
      }
    });
    commands.registerCommand(BuildDockerfileCommand, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please input the Docker Image name:Image tag!'
        });

        this.fileDialogService.showOpenDialog({
          title: BuildDockerfileCommand.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
        }).then((selectUri: URI | undefined) => {
          if (selectUri && result) {
            const currentTerminal = this.terminalService.currentTerminal;

            if (currentTerminal === undefined) {
              alert('current terminal undefined!');
              return;
            } else {
              const fileFullPath = selectUri.toString();
              const filePathElement = selectUri.toString().split('/');
              const filename = filePathElement[filePathElement.length - 1];
              const filePath = fileFullPath.replace(filename, '').replace('file://', '');

              const buildDockerfileToDockerImage: CommandLineOptions = {
                cwd: filePath,   // Command실행 경로
                args: ['docker', 'build', '-t', result, '-f', 'Dockerfile', '.'],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                env: {}
              };
              currentTerminal.executeCommand(buildDockerfileToDockerImage);

              const printDockerImage: CommandLineOptions = {
                cwd: filePath,
                args: ['docker', 'images'],
                env: {}
              };
              currentTerminal.executeCommand(printDockerImage);
            }
          } else {
            alert('Not Select file!');
          }
        });
      }
    });
    commands.registerCommand(runDockerImgCommand, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please input the Docker Image run command! ex. docker run -it -v "$(pwd):/home/test" -p 80:80 exImg:1.0.0 '
        });

        const currentTerminal = this.terminalService.currentTerminal;

        if (currentTerminal === undefined) {
          alert('current terminal undefined!');
          return;
      commands.registerCommand(RegistryPushImg, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please input the Docker Image information! ex.gwangyong/keti-theia:1.0.8'
        });
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        const currentTerminal = this.terminalService.currentTerminal;

        if (result && currentTerminal) {
          const RegistryPushImgCommand: CommandLineOptions = {
            cwd: rootUri,   // Command실행 경로
            args: ['docker', 'push', result],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
            env: {}
          };
          currentTerminal.executeCommand(RegistryPushImgCommand);
        }
      }
    });
    }
  }

  @injectable()
  export class SampleMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    setTimeout(() => {
    const subMenuPath = [...MAIN_MENU_BAR, 'sample-menu'];
    menus.registerSubmenu(subMenuPath, 'Sample Menu', {
      order: '2' // that should put the menu right next to the File menu
    });

  }, 10000);
}

}

/**
 * Special menu node that is not backed by any commands and is always disabled.
 */
export class PlaceholderMenuNode implements MenuNode {

  constructor(readonly id: string, public readonly label: string, protected options?: SubMenuOptions) { }

  get icon(): string | undefined {
    return this.options?.iconClass;
  }

  get sortString(): string {
    return this.options?.order || this.label;
  }

}

export const bindSampleMenu = (bind: interfaces.Bind) => {
  bind(CommandContribution).to(SampleCommandContribution).inSingletonScope();
  bind(MenuContribution).to(SampleMenuContribution).inSingletonScope();
};
