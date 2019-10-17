"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import {
  createProtocol
  // installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// modal screens
let teacherDetailsWin,
  editTeacherDetailsWin,
  editStudentDetailsWin,
  studentDetailsWin;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      secure: true,
      standard: true
    }
  }
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1140,
    height: 680,
    minWidth: 1140,
    minHeight: 680,
    maxWidth: 1140,
    maxHeight: 680,
    webPreferences: {
      nodeIntegration: true
    }
  });

  teacherDetailsWin = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    maxWidth: 700,
    maxHeight: 600,
    webPreferences: {
      nodeIntegration: true
    },
    parent: win,
    show: false,
    frame: false
  });

  editTeacherDetailsWin = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    maxWidth: 700,
    maxHeight: 600,
    webPreferences: {
      nodeIntegration: true
    },
    parent: win,
    show: false,
    frame: false
  });

  editStudentDetailsWin = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    maxWidth: 700,
    maxHeight: 600,
    webPreferences: {
      nodeIntegration: true
    },
    parent: win,
    show: false,
    frame: false
  });

  studentDetailsWin = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    maxWidth: 700,
    maxHeight: 600,
    webPreferences: {
      nodeIntegration: true
    },
    parent: win,
    show: false,
    frame: false
  });

  // disable default menu
  win.setMenuBarVisibility(false);
  win.removeMenu();

  teacherDetailsWin.setMenuBarVisibility(false);
  teacherDetailsWin.removeMenu();

  editTeacherDetailsWin.setMenuBarVisibility(false);
  editTeacherDetailsWin.removeMenu();

  editStudentDetailsWin.setMenuBarVisibility(false);
  editStudentDetailsWin.removeMenu();

  studentDetailsWin.setMenuBarVisibility(false);
  studentDetailsWin.removeMenu();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);

    // Load url of teachers details
    teacherDetailsWin.loadURL(
      process.env.WEBPACK_DEV_SERVER_URL + "/#/teachers/teacherDetails"
    );

    // load url of edit teachers details
    editTeacherDetailsWin.loadURL(
      process.env.WEBPACK_DEV_SERVER_URL + "/#/teachers/editTeacherDetails"
    );

    // Load url of student details
    studentDetailsWin.loadURL(
      process.env.WEBPACK_DEV_SERVER_URL + "/#/students/studentDetails"
    );

    // load url of edit student details
    editStudentDetailsWin.loadURL(
      process.env.WEBPACK_DEV_SERVER_URL + "/#/students/editStudentDetails"
    );

    // Open the DevTools.
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });

  teacherDetailsWin.on("close", e => {
    e.preventDefault();
    teacherDetailsWin.hide();
  });

  editTeacherDetailsWin.on("close", e => {
    e.preventDefault();
    editTeacherDetailsWin.hide();
  });

  studentDetailsWin.on("close", e => {
    e.preventDefault();
    studentDetailsWin.hide();
  });

  editStudentDetailsWin.on("close", e => {
    e.preventDefault();
    editStudentDetailsWin.hide();
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow();
});

ipcMain.on("toggle-teacher-details", (event, arg) => {
  teacherDetailsWin.show();
  teacherDetailsWin.webContents.send("id", arg);
});

ipcMain.on("toggle-edit-teacher-details", (event, arg) => {
  editTeacherDetailsWin.show();
  editTeacherDetailsWin.webContents.send("id", arg);
});

ipcMain.on("toggle-student-details", (event, arg) => {
  studentDetailsWin.show();
  studentDetailsWin.webContents.send("id", arg);
});

ipcMain.on("toggle-edit-student-details", (event, arg) => {
  editStudentDetailsWin.show();
  editStudentDetailsWin.webContents.send("id", arg);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
