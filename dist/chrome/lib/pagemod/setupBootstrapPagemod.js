/**
 * Setup bootstrap pagemod.
 *
 * This pagemod help bootstrap the first step of the setup process from a passbolt server app page
 * The pattern for this url, driving the setup bootstrap, is defined in config.json
 *
 * @copyright (c) 2015-present Bolt Softwares Pvt Ltd
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */
var self = require('sdk/self');
var app = require('../main');
var pageMod = require('sdk/page-mod');
var Config = require('../model/config');
var Worker = require('../model/worker');

// @TODO make sure we load the pagemod only if the plugin is not already configured
// @TODO delete the pagemod if the config is complete

var SetupBootstrap = function () {
};
SetupBootstrap._pageMod = undefined;

SetupBootstrap.init = function () {
  if (typeof SetupBootstrap._pageMod !== 'undefined') {
    SetupBootstrap._pageMod.destroy();
  }

  SetupBootstrap._pageMod = pageMod.PageMod({
    include: new RegExp(Config.read('setupBootstrapRegex') + '.*'),
    contentScriptWhen: 'ready',
    contentScriptFile: [
      self.data.url('vendors/jquery.min.js'),
      self.data.url('js/lib/message.js'),
      self.data.url('js/lib/request.js'),
      self.data.url('js/setup/bootstrap.js')
    ],
    onAttach: function (worker) {
      Worker.add('SetupBootstrap', worker);
      app.events.config.listen(worker);
      app.events.setupbootstrap.listen(worker);
    }
  });
};

exports.SetupBootstrap = SetupBootstrap;