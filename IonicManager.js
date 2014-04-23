/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, require, $, brackets, window, console, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var Ionic                 = require("Ionic"),
        IonicManagerMenus     = require("IonicManagerMenus"),
        IonicManagerPanel     = require("IonicManagerPanel"),
        IonicNewProjectDialog = require("IonicNewProjectDialog"),
        IonicSettingsDialog   = require("IonicSettingsDialog"),
        IonicPluginsDialog    = require("IonicPluginsDialog");
    
    var instance;
    
    function IonicManager() {
        this.ionic = undefined;
        this.managerMenus = undefined;
        this.managerPanel = undefined;
        this.dialogNewProject = undefined;
        this.dialogSettings = undefined;
        this.dialogPlugins = undefined;
    }
    
    IonicManager.getInstance = function () {
        return instance;
    };
    
    IonicManager.prototype.initialize = function () {
        this.ionic = new Ionic(this);
        this.managerMenus = new IonicManagerMenus(this);
        this.managerPanel = new IonicManagerPanel(this);
        this.dialogNewProject = new IonicNewProjectDialog(this);
        this.dialogSettings = new IonicSettingsDialog(this);
        this.dialogPlugins = new IonicPluginsDialog(this);
    };
    
    IonicManager.prototype.showRunCommandDialog = function () {
        this.runDialog.show();
    };
    
    IonicManager.prototype.runCommand = function (cmd, path) {
        return this.ionic.execute(cmd, path);
    };
    
    instance = new IonicManager();

    module.exports = instance;
});