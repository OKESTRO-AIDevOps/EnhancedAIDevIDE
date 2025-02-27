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
};


@injectable()
export class SampleCommandContribution implements CommandContribution {

    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;

    @inject(MessageService)
    protected readonly messageService: MessageService;

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

    // 사용자가 선택한 Golang 실행 커멘드 메뉴
    commands.registerCommand(RunGolangCommand, {
      execute: async () => {
        this.fileDialogService.showOpenDialog({
          title: RunGolangCommand.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
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

              const runGolangCommandLine: CommandLineOptions = {
                cwd: filePath,   // Command실행 경로
                args: ['go', 'run', filename],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                env: {}
              };
              currentTerminal.executeCommand(runGolangCommandLine);
            }
          } else {
            alert('Not Select file!');
          }
        });
      }
    });
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
    );    
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
