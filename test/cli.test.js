const { compileData, start } = require("../lib/cli");
const { assert } = require("chai");
const path = require("path");
const fs = require("fs");
describe("compileData function TeddyTags CLI", () => {
  let dataToBeCompiled = `<lol::h1>
  <foo::h2>
  <bar::button>`;
  let compiledData = compileData(dataToBeCompiled);
  let shouldBeCompiledData = [
    "new TeddyTags('lol').set('h1')",
    "new TeddyTags('foo').set('h2')",
    "new TeddyTags('bar').set('button')"
  ];
  compiledData.forEach((cline, index) => {
    let line = shouldBeCompiledData[index];
    it(`will check line ${(index += 1)} of the three compiled to be equal to expected output`, () => {
      assert.equal(cline, line);
    });
  });
});
describe("start function TeddyTags CLI file checks", () => {
  let fileToCompile = path.join(__dirname, "./teddy.td");
  let fileCompiledPath = path.join(__dirname, "./teddy.js");
  let shouldBeCompiledData = [
    "new TeddyTags('hello').set('h1')",
    "new TeddyTags('world').set('h2')",
    "new TeddyTags('simple').set('buttton')",
    "new TeddyTags('long').set('p')"
  ].join("\n");
  //Compile the file
  start(["", "", fileToCompile]);
  it("will check compiled lines", done => {
    fs.readFile(fileCompiledPath, "utf-8", (err, data) => {
      assert.strictEqual(data, shouldBeCompiledData);
      done();
    });
  });
  it("should be a compiled file named teddy.js", done => {
    fs.exists(fileCompiledPath, exists => {
      assert.strictEqual(exists, true);
      done();
    });
  });
});
