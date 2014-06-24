(function () {
    "use strict";
    
    var childProcess = require("child_process"),
        spawn = childProcess.spawn,
        exec = childProcess.exec,
        DOMAIN = "ionicManager",
        RUN_COMMAND = "runCommand";
    
    function runCommand(command, directoryPath, cb) {

        if (!/^ionic /.test(command) && !/^cordova /.test(command)) {
            throw new Error("No arbitrary executions with ionic/cordova please!");
        }
        
        var acmd = command.match(/[a-zA-Z0-9_\\\/\.\-]+|'[^']+'|"[^"]+"/g),
            ionic = acmd.shift(), // this should be ionic, or we have a problem
            proc,
            error = "",
            output = "";
        
        //proc = spawn(ionic, acmd, {cwd: directoryPath});
        var isWin = /^win/.test(process.platform);
		var exportPath="";
		
		if(!isWin){
		exportPath="export PATH=/usr/local/bin:$PATH &&";
		}
		
		proc = exec(exportPath + command, {cwd: directoryPath});
        proc.stdout.on("data", function (data) {
            output += data;
        });
        
        // append errors to output instead, so that we get all of the content back in
        // the output field in the UI. We don't really need to distinguish.
        proc.stderr.on("data", function (err) {
            output += err;
        });
        
        proc.on("close", function (code) {
            output += "\n" + command + " completed with exit code " + code;
            cb(undefined, output);
        });
    }
    
    exports.init = function (DomainManager) {
        if (!DomainManager.hasDomain(DOMAIN)) {
            DomainManager.registerDomain(DOMAIN, {major: 0, minor: 1});
        }
        
        DomainManager.registerCommand(
            DOMAIN,
            RUN_COMMAND,
            runCommand,
            true,
            "Runs an arbitrary Ionic command.",
            [
                {
                    name: "command",
                    type: "string",
                    description: "Command to run"
                }
            ],
            [
                {
                    name: "confirmation",
                    type: "object",
                    description: "Returns command executed and the folder passed in"
                }
            ]
        );
    };
}());
