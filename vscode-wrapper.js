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

const log = () => {
    console.log.apply(null, arguments);
    return {
        dispose: () => { },
    };
}

const vscodeWindow = {
    showWarningMessage: log,
    showErrorMessage: log,
    setStatusBarMessage: log,
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
    file: (arg) => {
        return "file://" + path.join(process.cwd(), arg);
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
}
