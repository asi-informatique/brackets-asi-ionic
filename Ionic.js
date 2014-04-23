/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, require, $, brackets, window, console */

define(function (require, exports, module) {
    "use strict";
    
    var NodeConnection = brackets.getModule("utils/NodeConnection"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    
    var nodeConnection = new NodeConnection(), // mind as well share a connection for all Git repos
        path = ExtensionUtils.getModulePath(module, "node/IonicChildProcess"),
        disconnectedIonics = [],
        connected = false,
        LOGGING_ENABLED = true;
    
    function log() {
        if (LOGGING_ENABLED) {
            console.log(arguments);
        }
    }
    
    nodeConnection.connect(true).done(function () {
        var p = nodeConnection.loadDomains([path], true);
        
        p.done(function () {
            connected = true;
            
            while (disconnectedIonics.length > 0) {
                disconnectedIonics.shift().connecting.resolve();
            }
        });
        
        p.fail(function () {
            log("[asi.ionic] Error connecting to Node:");
            log(arguments);
        });
    });

    function Ionic(ionicManager) {
        this.ionicManager = ionicManager;
        this.connecting = $.Deferred();

        if (!connected) {
            disconnectedIonics.push(this);
        } else {
            this.connecting.resolve();
        }
    }
        
    /**
    * @throws Error Executing a command that's not a ionic command throws an error
    * @returns {promise} Promise for the Node connection
    */
    Ionic.prototype.execute = function (cmd, path) {
        
        var self = this;
        
        if (self.connecting.state() !== "resolved") {
            throw new Error("Node connection for ionic not yet established.");
        }
        console.log('Ionic:execute:' + cmd);
        self.ionicManager.managerPanel.$iconIonic.addClass('process');
        
        // Get current project root path
        var pathToUse = path;
        if (typeof pathToUse === 'undefined') {
            pathToUse = ProjectManager.getProjectRoot().fullPath;
        }
                
        // Run command
        var commandPromise = nodeConnection.domains.ionicManager.runCommand(cmd, pathToUse);
        commandPromise.fail(function (err) {
            console.error("[asi.ionic] failed to run ionicManager.runCommand : ", err);
            self.ionicManager.managerPanel.$iconIonic.removeClass('process');
        });
        commandPromise.done(function (results) {
            console.log(results);
            self.ionicManager.managerPanel.$iconIonic.removeClass('process');
        });
        return commandPromise;
    };
    
    module.exports = Ionic;
});