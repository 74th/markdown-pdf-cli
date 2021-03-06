'use strict'
const fs = require("fs");
const process = require("process");
const path = require("path");

const vscodeDocument = {
    languageId: "markdown",
    fileName: "",
    uri: {
        fsPath: "",
    },
    getText: () => {
        return fs.readFileSync(vscodeDocument.fileName, { encoding: "utf8" });
    },
}
const vscodeEditor = {
    isUntitled: false,
    document: vscodeDocument,
}

const vscodeProgressLocation = {
    Notification: null,
}

const log = (mes) => {
    console.log.apply(null, arguments);
    return {
        dispose: () => { },
    };
}

const message = (mes) => {
    console.log(mes);
    return {
        dispose: () => { },
    };
}

const vscodeWindow = {
    showWarningMessage: log,
    showErrorMessage: log,
    showInformationMessage: log,
    setStatusBarMessage: message,
    ProgressLocation: null,
    activeTextEditor: vscodeEditor,
    document: vscodeDocument,
    withProgress: async (conf, progress) => {
        console.log(conf.title);
        await progress();
    }
}

const vscodeWorkspace = {
    _settings: {},
    getConfiguration: (_) => {
        return vscodeWorkspace._settings;
    },
    getWorkspaceFolder: () => {
        return {
            uri: {
                fsPath: process.cwd(),
            }
        }
    },
}

const vscodeCommands = {
    _commands: {},
    registerCommand: (name, callback) => {
        vscodeCommands._commands["name"] = callback;
    }
};

function setSettings(settings){
    vscodeWorkspace._settings = settings;
}

function setFilename(fileName) {
    vscodeDocument.fileName = fileName;
    vscodeDocument.uri.fsPath = fileName;
}

const vscodeUri = {
    parse: (arg) => {
        return arg;
    },
    file: (arg) => {
        return "file://" + path.resolve(arg);
    },
};

const dummyContext = {
    subscriptions: [],
}

module.exports = {
    workspace: vscodeWorkspace,
    window: vscodeWindow,
    commands: vscodeCommands,
    ProgressLocation: vscodeProgressLocation,
    Uri: vscodeUri,
    setSettings,
    setFilename,
    dummyContext,
    get ["env"]() {
        return vscodeWorkspace._settings["env"];
    },
}
