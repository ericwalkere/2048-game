// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    mBackground: cc.Node,
    mNumber: cc.Label,
  },

  setTile(data) {
    this.mBackground.color = cc.color(data.skin);
    this.mNumber.string = data.number.toString();
  },

  moveTo(newPos) {
    const distance = Math.abs(newPos - this.node);
    const duration = distance / 100;
    cc.tween(this.node)
    .to(duration, {position:newPos})
    .start();
  },
});
