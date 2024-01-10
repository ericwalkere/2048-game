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
    skin: cc.Node,
    textValue: cc.Label,
    efxLabel: cc.Label,
    anim: cc.Animation,
  },

  setTile(data) {
    this.skin.color = cc.color(data.skin);
    this.textValue.string = data.text;
    this.textValue.node.color = cc.color(data.textColor);
    this.efxLabel.string = data.text;
  },

  mergeAnim() {
    this.anim.play("merge");
  },
});
