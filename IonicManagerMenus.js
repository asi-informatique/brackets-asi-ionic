/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        Menus           = brackets.getModule("command/Menus"),
        Constants       = require("IonicManagerConstants");

    function IonicManagerMenus(ionicManager) {
        this.ionicManager = ionicManager;
        this.$dialogNewProject = $(require("text!html/dialog-new-project.html"));
        this.createMenus();
    }
    
    /** Initialize Brackets menus */
    IonicManagerMenus.prototype.createMenus = function () {
        
        var self = this;
        var menuCommands = [{
            'title': 'Create New Project',
            'id': 'asi.ionic.menu.new-project',
            'action': function () { self.ionicManager.dialogNewProject.show(); }
        }, {
            'title': 'Android - Run',
            'id': 'asi.ionic.menu.android-run',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_ANDROID_RUN); }
        }, {
            'title': 'Android - Build',
            'id': 'asi.ionic.menu.android-build',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_ANDROID_BUILD); }
        }, {
            'title': 'Android - Add Platform',
            'id': 'asi.ionic.menu.android-add-platform',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_ANDROID_ADD); }
        }, {
            'title': 'Android - Remove Platform',
            'id': 'asi.ionic.menu.android-remove-platform',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_ANDROID_REMOVE); }
        }, {
            'title': 'iOS - Run',
            'id': 'asi.ionic.menu.ios-run',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_IOS_RUN); }
        }, {
            'title': 'iOS - Build',
            'id': 'asi.ionic.menu.ios-build',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_IOS_BUILD); }
        }, {
            'title': 'iOS - Add Platform',
            'id': 'asi.ionic.menu.ios-add-platform',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_IOS_ADD); }
        }, {
            'title': 'iOS - Remove Platform',
            'id': 'asi.ionic.menu.ios-remove-platform',
            'action': function () { self.ionicManager.runCommand(Constants.CMD_IOS_REMOVE); }
        }, {
            'title': 'Plugins',
            'id': 'asi.ionic.menu.plugins',
            'action': function () { self.ionicManager.dialogPlugins.show(); }
        }, {
            'title': 'Preferences...',
            'id': 'asi.ionic.menu.settings',
            'action': function () { self.ionicManager.dialogSettings.show(); }
        }];
        
        var menu = Menus.addMenu('Ionic', 'asi.ionic.menu');
        $.each(menuCommands, function () {
            
            CommandManager.register(this.title, this.id, this.action);
            menu.addMenuItem(this.id);
            
            if ($.inArray(this.id, ['asi.ionic.menu.new-project', 'asi.ionic.menu.android-remove-platform', 'asi.ionic.menu.ios-remove-platform']) >= 0) {
                menu.addMenuDivider();
            }
        });
    };
    
    module.exports = IonicManagerMenus;
});