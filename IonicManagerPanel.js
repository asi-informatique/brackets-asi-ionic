/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager = brackets.getModule("command/CommandManager"),
        PanelManager   = brackets.getModule("view/PanelManager"),
        Constants      = require("IonicManagerConstants");

    function IonicManagerPanel(ionicManager) {
        this.ionicManager = ionicManager;
        this.panel = undefined;
        
        this.$panel = $(require("text!html/panel.html"));
        this.$iconIonic = $('<a id="toolbar-ionic" title="Ionic" href="#"></a>');
        this.$loader = this.$panel.find('.loader');
        
        this.createPanel();
    }
    
    /** Initialize Brackets panel */
    IonicManagerPanel.prototype.createPanel = function () {
        
        var self = this;
        
        // Panel
        self.panel = PanelManager.createBottomPanel('asi.ionic.panel', self.$panel, 110);
            
        // Ionic Icon
        self.$iconIonic.appendTo($("#main-toolbar .buttons"));
        self.$iconIonic.on('click', function (e) {
            e.preventDefault();
            self.$iconIonic.toggleClass('open');

            if (self.$iconIonic.hasClass('open')) {
                self.panel.show();
            } else {
                self.panel.hide();
            }
        });
        
        // Header Panel's actions
        self.$panel.find('.dialog-new').on('click', function (e) {
            e.preventDefault();
            self.ionicManager.dialogNewProject.show();
        });
        self.$panel.find('.dialog-plugins').on('click', function (e) {
            e.preventDefault();
            self.ionicManager.dialogPlugins.show();
        });
        self.$panel.find('.dialog-settings').on('click', function (e) {
            e.preventDefault();
            self.ionicManager.dialogSettings.show();
        });

        // Content Panel's actions
        self.$panel.find('.add').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconIonic.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.ionicManager.runCommand(Constants.CMD_ANDROID_ADD);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.ionicManager.runCommand(Constants.CMD_IOS_ADD);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconIonic.removeClass('process').addClass('open');
            });
        });
        self.$panel.find('.build').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconIonic.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.ionicManager.runCommand(Constants.CMD_ANDROID_BUILD);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.ionicManager.runCommand(Constants.CMD_IOS_BUILD);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconIonic.removeClass('process').addClass('open');
            });
        });
        self.$panel.find('.run').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconIonic.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.ionicManager.runCommand(Constants.CMD_ANDROID_RUN);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.ionicManager.runCommand(Constants.CMD_IOS_RUN);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconIonic.removeClass('process').addClass('open');
            });
        });
        self.$panel.find('.remove').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconIonic.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.ionicManager.runCommand(Constants.CMD_ANDROID_REMOVE);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.ionicManager.runCommand(Constants.CMD_IOS_REMOVE);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconIonic.removeClass('process').addClass('open');
            });
        });
    };
    
    module.exports = IonicManagerPanel;
});