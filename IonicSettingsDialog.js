/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        Strings         = brackets.getModule("strings"),
        Constants       = require("IonicManagerConstants");

    var defaultPreferences = {
		workspace: ""
	};
    
    function IonicSettingsDialog(ionicManager) {
        
        var self = this;
        this.ionicManager = ionicManager;
        this.$dialog = $(require("text!html/dialog-settings.html"));
        this.$inputWorkspace = this.$dialog.find('#ionic-settings-workspace');
    }
    
    IonicSettingsDialog.prototype.getSettings = function () {
        var settings = localStorage.getItem(Constants.LOCAL_STORAGE_SETTINGS);
		return (settings === null) ? defaultPreferences : JSON.parse(settings);
	};
    
    /** Show dialog */
    IonicSettingsDialog.prototype.show = function () {
        
        var self = this;
        var Settings = self.getSettings();
              
        // Change destination folder
        this.$dialog.find('#ionic-settings-workspace-change').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            FileSystem.showOpenDialog(false, true, Strings.CHOOSE_FOLDER, Settings.workspace, null,
                function (error, files) {
                    if (!error && files && files.length > 0 && files[0].length > 0) {
                        self.$dialog.find('#ionic-settings-workspace').val(files[0]);
                    }
                });
        });
        
        // On submit
        this.$dialog.find('#ionic-settings-submit').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.submit();
        });
        
        // Prefill
        this.$inputWorkspace.val(Settings.workspace);
                
        Dialogs.showModalDialogUsingTemplate(this.$dialog);
    };
    
    /** Hide dialog */
    IonicSettingsDialog.prototype.close = function () {
        Dialogs.cancelModalDialogIfOpen('dialog-ionic-settings');
    };
    
    /** Save */
    IonicSettingsDialog.prototype.submit = function () {
        
        var Settings = this.getSettings();
        Settings.workspace = this.$inputWorkspace.val();
        
        localStorage.setItem(Constants.LOCAL_STORAGE_SETTINGS, JSON.stringify(Settings));
        this.close();
    };
    
    module.exports = IonicSettingsDialog;
});