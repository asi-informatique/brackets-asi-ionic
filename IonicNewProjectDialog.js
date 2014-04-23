/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Commands        = brackets.getModule("command/Commands"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        ProjectManager  = brackets.getModule("project/ProjectManager"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        Strings         = brackets.getModule("strings"),
        Constants       = require("IonicManagerConstants");

    function IonicNewProjectDialog(ionicManager) {
        
        var self = this;
        this.ionicManager = ionicManager;
        this.$dialog = $(require("text!html/dialog-new-project.html"));
        this.$loader = this.$dialog.find('.loader');
        this.$inputName = this.$dialog.find('#ionic-new-name');
        this.$inputDestination = this.$dialog.find('#ionic-new-dest');
    }
    
    /** Show dialog */
    IonicNewProjectDialog.prototype.show = function () {
        
        var self = this;
        self.$loader.hide();
        var Settings = self.ionicManager.dialogSettings.getSettings();
        
        // Prefill
        this.$inputName.val('');
        this.$inputDestination.val(Settings.workspace);
                        
        // Change destination folder
        this.$dialog.find('#ionic-new-dest-change').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            FileSystem.showOpenDialog(false, true, Strings.CHOOSE_FOLDER, Settings.workspace, null,
                function (error, files) {
                    if (!error && files && files.length > 0 && files[0].length > 0) {
                        self.$dialog.find('#ionic-new-dest').val(files[0]);
                    }
                });
        });
        
        // On submit
        this.$dialog.find('#ionic-new-submit').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.submit();
        });
                
        // Show
        Dialogs.showModalDialogUsingTemplate(this.$dialog);
        self.$inputName.focus();
    };
    
    /** Hide dialog */
    IonicNewProjectDialog.prototype.close = function () {
        
        this.$loader.hide();
        Dialogs.cancelModalDialogIfOpen('dialog-ionic-new-project');
    };
    
    /** Check form */
    IonicNewProjectDialog.prototype.isValidForm = function () {
        
        var isValid = true;

        // Check all inputs are not empty
        $.each([this.$inputName, this.$inputDestination], function () {
            
            var $controlGroup = this.parents('.control-group');
            var $helpInline = $controlGroup.find('.help-inline');
            
            if (this.val().toString().length === 0) {
                $helpInline.removeClass('hide');
                $controlGroup.addClass('error');
                isValid = false;
            } else {
                $helpInline.addClass('hide');
                $controlGroup.removeClass('error');
            }
        });
        
        return isValid;
    };
    
    /** Submit */
    IonicNewProjectDialog.prototype.submit = function () {
        
        this.$loader.show();
        
        var self = this;
        var pathDest = this.$inputDestination.val().toString();
        console.log(pathDest);
        if (pathDest.substr(-1) !== "/") {
            pathDest += '/';
        }
        
        if (self.isValidForm()) {
            
            // Building command
            var cmd = 'ionic start';
            cmd += ' "' + this.$inputName.val() + '"';
            cmd += ' ' + self.$dialog.find("input[name='ionic-new-type']:checked").val();
            
            var projectPath = pathDest + this.$inputName.val();
            var promise = this.ionicManager.runCommand(cmd, this.$inputDestination.val());
            promise.done(function () {
                ProjectManager.openProject(projectPath).done(function () {
                    CommandManager.execute(Commands.FILE_ADD_TO_WORKING_SET, { fullPath: projectPath + '/www/index.html' });
                    self.close();
                });
            });
        }
    };
    
    module.exports = IonicNewProjectDialog;
});