var fs = require('fs');
var sha256 = require('js-sha256');

var fileName = '6.1.intro.mp4';
var fileName2 = '6.2.birthday.mp4';

function readFile(name) {
    var file = fs.readFileSync(name);
    var resto = file.length % 1024;
    var nBlocks = Math.trunc(file.length / 1024);
    var blocks = [];
    var rest = 1024;
    for (var i = 0; i < nBlocks + 1; i++){
        if (i == nBlocks) {
            rest = resto;
        }
        blocks[i] = file.slice(i * 1024, i * 1024 + rest);
    }
    return blocks;
}

function getHash(blocks) {
    var hash = undefined;
    var array = undefined;
    var buf = undefined;
    for (var i = blocks.length - 1; i >= 0; i--) {
        if (i != 0) {
            hash = Buffer.from(sha256.array(blocks[i]));
            array = Buffer.from(blocks[i - 1]);
            buf = [array, hash];
            blocks[i - 1] = Buffer.concat(buf);
        } else {
            var hashHex = sha256.hex(blocks[i]);
            hash = sha256.array(blocks[i]);
        }
    }
    return hash;
}

function getVideo(hash, blocks) {
    var nextHash = hash;
    var newHash = undefined;
    for (var i = 0; i < blocks.length; i++) {
        newHash = sha256.array(blocks[i]);
        for (var j = 0; j < nextHash.length; j++) {
            if (newHash[j] === nextHash[j]) {
            } else {
                console.log('File corrupted')
            }
        }
    }
}

var blocks = readFile(fileName);
var hash = getHash(blocks);
var Video = getVideo(hash, blocks);