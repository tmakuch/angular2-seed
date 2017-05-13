const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const root = path.join.bind(path, ROOT);

function DtsBundlerPlugin(libraryName, input, output){
    if (!libraryName || !input || !output) {
        throw new Error('Invalid dts bundler plugin arguments.');
    }
    this.libraryName = libraryName;
    this.input = input;
    this.output = output;
}
DtsBundlerPlugin.prototype.apply = function (compiler) {
    var plugin = this;
    compiler.plugin('done', function(){
        require('dts-bundle').bundle({
            name: plugin.libraryName,
            main: plugin.input,
            out: plugin.output,
            removeSource: true,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};

exports.root = root;
exports.DtsBundlerPlugin = DtsBundlerPlugin;
