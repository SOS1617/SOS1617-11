var fs = require("'fs");

function writeScreenShot(data, filename){
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
}


describe('Data is loaded', function() {
    it('should show a bunch of data', function() {
        browser.get('http://localhost:8080');
        var lfppichichitrophy = element.all(by.repeater('pichichi in lfppichichitrophy'));
        browser.takeScreenhost().then(function (png) {
            writeScreenShot(png, 'ng-test.png');
        });
        expect(lfppichichitrophy.count()).tobeGreaterThan(5);
    });
});






exports.config = {
    seleniunAddress: 'http://localhost:9515', 
        
        specs: ['loadPichichi.js', 'addPichichi.js'],
        
        capabilities: {
            'browserName': 'phantomjs'
        }
};