// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Test, { fengjuyi } from "./Test";

const { ccclass, property } = cc._decorator;



@ccclass
export default class InsLine extends cc.Component {

    @property(cc.Node)
    parent: cc.Node = null;

    public polygonCollider: cc.PolygonCollider = null;

    @property(cc.Prefab)
    line: cc.Prefab = null;


    start() {
        this.polygonCollider = this.node.getComponent(cc.PolygonCollider);
        for (let index = 0; index < this.polygonCollider.points.length; index++) {
      
            let tempLine = null;
            if (fengjuyi.lineArr.size() > 0) {
                tempLine = fengjuyi.lineArr.get();
            } else {
                tempLine = cc.instantiate(fengjuyi.linePrefab);
            }

            tempLine.parent = this.parent;
            let subVec = null;
            if (index < this.polygonCollider.points.length - 1) {
                subVec = this.polygonCollider.points[index].sub(this.polygonCollider.points[index + 1]);
            } else {
                subVec = this.polygonCollider.points[index].sub(this.polygonCollider.points[0]);
            }
            let tempVec = cc.v2(1, 0);

            let rotateVec = subVec.signAngle(tempVec)
            let degree = Math.floor(cc.misc.radiansToDegrees(rotateVec));
            tempLine.position = this.polygonCollider.points[index];
            tempLine.angle = 360 - degree;

            tempLine.active = true;
        }
    }

    // update (dt) {}
}
