import {formatTranslate} from "Chart/Flexable";
declare var QUnit:any;
QUnit.test( "formatTranslate", function( assert ) {
  assert.deepEqual(formatTranslate("translate(0,0)"),["0","0"],"formatTranslate 0 0")
  assert.deepEqual(formatTranslate("translate(-1,0)"),["-1","0"],"formatTranslate -1 0")
  assert.deepEqual(formatTranslate("translate()"),["0","0"],"formatTranslate ")
  assert.deepEqual(formatTranslate("translate(0)"),["0","0"],"formatTranslate 0")
  assert.deepEqual(formatTranslate("translate(10,2)"),["10","2"],"formatTranslate 10 2")
});