// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
export let fengjuyi:Test = null;
@ccclass
export default class Test extends cc.Component {

    @property(cc.Camera)
    cameraMask: cc.Camera = null;

    @property(cc.Camera)
    cameraGraphics: cc.Camera = null;

    @property(cc.Prefab)
    linePrefab: cc.Prefab = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property(cc.Node)
    ball: cc.Node = null;

    @property(cc.Graphics)
    linePhysics: cc.Graphics = null;

    @property(cc.Node)
    point01: cc.Node = null;

    @property(cc.Node)
    point02: cc.Node = null;

    @property(cc.Node)
    parent: cc.Node = null;

    public lineArr: cc.NodePool = null;

    private maskRenderTexture: cc.RenderTexture;
    private graphicsRenderTexture: cc.RenderTexture;

    private recordPos: cc.Vec2 = null;
    private currentPos: cc.Vec2 = null;


    onLoad() {
        fengjuyi =  this;
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.debugDrawFlags = 1;

        this.maskRenderTexture = new cc.RenderTexture();
        this.maskRenderTexture.initWithSize(cc.winSize.width, cc.winSize.height);
        this.cameraMask.targetTexture = this.maskRenderTexture;


        this.graphicsRenderTexture = new cc.RenderTexture();
        this.graphicsRenderTexture.initWithSize(cc.winSize.width, cc.winSize.height);
        this.cameraGraphics.targetTexture = this.graphicsRenderTexture;
        this.lineArr = new cc.NodePool();
        if (this.lineArr.size() <= 0) {
            for (let index = 0; index < 500; index++) {
                let tempLine = cc.instantiate(this.linePrefab);
                tempLine.parent = this.parent;
                tempLine.position = this.node.position;
                this.lineArr.put(tempLine)
            }
        }
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Touch) => {
            let point = event.getLocation();
            point = this.node.convertToNodeSpaceAR(point);
            this._addCircle(point);
            // let maskData = this.getMaskData(point);
            // let graphicsData = this.getGraphicsData(point);
            // console.log("graphicsData....", graphicsData);
            // console.log("getMaskData....", maskData);
            this.onTouchStartCallback(point);


        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Touch) => {
            let point = event.getLocation();
            point = this.node.convertToNodeSpaceAR(point);
            this._addCircle(point);
            // let maskData = this.getMaskData(point);
            // let graphicsData = this.getGraphicsData(point);
            // // console.log("graphicsData....", graphicsData);
            // // console.log("getMaskData....", maskData);
            this.onTouchMoveCallback(point);

        })

        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Touch) => {
            this.onTouchEndCallback();
        })
    }


    //获取RGB
    getMaskData(point) {
        let Uint8: Uint8Array = null;
        Uint8 = this.cameraMask.targetTexture.readPixels(Uint8, (point.x + 540), (point.y + 960), 1, 1);
        return Uint8;
    }


    getGraphicsData(point) {
        let Uint8: Uint8Array = null;
        Uint8 = this.cameraGraphics.targetTexture.readPixels(Uint8, (point.x + 540), (point.y + 960), 1, 1);
        return Uint8;
    }

    _addCircle(pos) {
        this.mask._graphics.strokeColor = cc.color(255, 0, 0, 255);
        this.mask._graphics.fillColor = cc.color(255, 0, 0, 255);
        this.mask._graphics.circle(pos.x, pos.y, 40);
        this.mask._graphics.fill();
    }


    onTouchStartCallback(pos) {
        this.linePhysics.strokeColor = cc.color(255, 0, 0, 255);
        this.linePhysics.fillColor = cc.color(255, 0, 0, 255);
        this.linePhysics.circle(pos.x, pos.y, 21);
        this.linePhysics.stroke();
        this.linePhysics.moveTo(pos.x, pos.y);
        this.ball.position = pos;
        this.recordPos = cc.v2(pos.x, pos.y);
    }


    onTouchMoveCallback(pos) {
        this.ball.position = pos;
        this.linePhysics.strokeColor = cc.color(255, 0, 0, 255);
        this.linePhysics.fillColor = cc.color(255, 0, 0, 255);
        this.linePhysics.circle(pos.x, pos.y, 21);
        this.linePhysics.stroke();
        this.linePhysics.moveTo(pos.x, pos.y);
        // 记录当前手移动到的点
        this.currentPos = cc.v2(pos.x, pos.y);
        //求两点之间的距离
        let subVec = this.currentPos.subSelf(this.recordPos);
        let distance = subVec.mag() + 5;
        // 如果距离大于一定值，这里的25是预制体的width
        if (distance >= 25) {
            // 给定方向向量
            let tempVec = cc.v2(0, 10);
            // 求两点的方向角度
            let rotateVec = subVec.signAngle(tempVec) / Math.PI * 180 - 90;
            //球的方向
            this.ball.angle = 90 - rotateVec
            let tempPos01 = this.ball.convertToWorldSpaceAR(this.point01.position);
            tempPos01 = this.node.convertToNodeSpaceAR(tempPos01);
            let graphicsData01 = this.getGraphicsData(tempPos01);
            let maskData01 = this.getMaskData(tempPos01);

            if (graphicsData01[0] == 255 && graphicsData01[1] == 0 && graphicsData01[2] == 0 && graphicsData01[3] == 255) {
                // console.log("已经画过了");
            } else {
                if ((maskData01[0] == 255 && maskData01[1] == 255 && maskData01[2] == 255 && maskData01[3] == 255) ||
                    (maskData01[0] == 255 && maskData01[1] == 0 && maskData01[2] == 0 && maskData01[3] == 255)) {
                    // console.log("不能画");
                } else {
                    // 创建预制体
                    let lineItem = null;

                    if (this.lineArr.size() > 0) {
                        lineItem = this.lineArr.get();
                    } else {
                        lineItem = cc.instantiate(this.linePrefab);
                    }

                    lineItem.angle = -rotateVec;
                    lineItem.parent = this.parent;
                    // 这一步是为了防止两个线段之间出现空隙，动态改变预制体的长度
                    // lineItem.setPosition(pos.x, pos.y);
                    lineItem.position = tempPos01;
                    lineItem.width = distance;
                    lineItem.getComponent(cc.PhysicsBoxCollider).offset.x = -lineItem.width / 2
                    //cc.log(lineItem.getComponent(cc.PhysicsBoxCollider).size);
                    //cc.log(lineItem.getComponent(cc.PhysicsBoxCollider).size.width, lineItem.width);
                    lineItem.getComponent(cc.PhysicsBoxCollider).size.width = lineItem.width;
                    lineItem.getComponent(cc.PhysicsBoxCollider).apply();
                }

            }

            let tempPos02 = this.ball.convertToWorldSpaceAR(this.point02.position);
            tempPos02 = this.node.convertToNodeSpaceAR(tempPos02);
            let graphicsData02 = this.getGraphicsData(tempPos02);
            let maskData02 = this.getMaskData(tempPos02);
            if (graphicsData02[0] == 255 && graphicsData02[1] == 0 && graphicsData02[2] == 0 && graphicsData02[3] == 255) {
                // console.log("已经画过了");
            } else {
                if ((maskData02[0] == 255 && maskData02[1] == 255 && maskData02[2] == 255 && maskData02[3] == 255) ||
                    (maskData02[0] == 255 && maskData02[1] == 0 && maskData02[2] == 0 && maskData02[3] == 255)) {
                    // console.log("不能画");
                } else {
                 let lineItem_01 = null;
                    if (this.lineArr.size() > 0) {
                        lineItem_01 = this.lineArr.get();
                    } else {
                        lineItem_01 = cc.instantiate(this.linePrefab);
                    }
                    lineItem_01.angle = -rotateVec;
                    lineItem_01.parent = this.parent;
                    // 这一步是为了防止两个线段之间出现空隙，动态改变预制体的长度
                    // lineItem.setPosition(pos.x, pos.y);
                    lineItem_01.position = tempPos02;
                    lineItem_01.width = distance;
                    lineItem_01.getComponent(cc.PhysicsBoxCollider).offset.x = -lineItem_01.width / 2
                    //cc.log(lineItem.getComponent(cc.PhysicsBoxCollider).size);
                    //cc.log(lineItem.getComponent(cc.PhysicsBoxCollider).size.width, lineItem.width);
                    lineItem_01.getComponent(cc.PhysicsBoxCollider).size.width = lineItem_01.width;
                    lineItem_01.getComponent(cc.PhysicsBoxCollider).apply();
                    // 将此时的触摸点设为记录
                }
            }
            this.recordPos = cc.v2(pos.x, pos.y);
        }
    }

    onTouchEndCallback() {
        console.log("touch end ... ");
    }
}
