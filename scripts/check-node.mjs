// Deliberately ES5-safe: this must run on the WRONG Node version too.
var required = 22;
var current = parseInt(process.versions.node.split('.')[0], 10);

if (current < required) {
  var nl = '\n';
  process.stderr.write(
    nl +
    '  Node ' + process.versions.node + ' is too old — this project needs Node ' + required + '+.' + nl +
    nl +
    '  The repo pins the version in .nvmrc, but nvm does not switch automatically.' + nl +
    '  Run this once per terminal session, from the project directory:' + nl +
    nl +
    '      nvm use' + nl +
    nl +
    '  If that prints "N/A", install it first:' + nl +
    nl +
    '      nvm install' + nl +
    nl +
    '  To switch automatically on cd, add nvm\'s shell hook to your ~/.zshrc:' + nl +
    '      https://github.com/nvm-sh/nvm#zsh' + nl +
    nl
  );
  process.exit(1);
}
