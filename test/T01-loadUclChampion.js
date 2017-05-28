var fs = require("'fs");

function writeScreenShot(data, filename){
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
}


describe('Data is loaded', function() {
    it('should show a bunch of data', function() {
        browser.get('http://localhost:8080');
        var uclchampions = element.all(by.repeater('uclchampion in uclchampions'));
        browser.takeScreenhost().then(function (png) {
            writeScreenShot(png, 'ng-test.png');
        });
        expect(uclchampions.count()).tobeGreaterThan(5);
    });
});






exports.config = {
    seleniunAddress: 'http://localhost:9515', 
        
        specs: ['loadUclChampion.js', 'addUclChampion.js'],
        
        capabilities: {
            'browserName': 'phantomjs'
        }
};