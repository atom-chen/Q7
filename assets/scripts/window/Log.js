var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        //确认框资源start
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        //确认框资源end
        logItemBox:{//日志列表项容器
            default:null,
            type:cc.Node
        },
        logItemPre:{//日志列表项预制
          default:null,
          type:cc.Prefab
        },
        nextBtn:{//下一页按钮
            default:null,
            type:cc.Node
        },
        preBtn:{//上一页按钮
            default:null,
            type:cc.Node
        },
        cuurentPage:{//当前页数
            default:null,
            type:cc.Label
        },
        allPage:{//总页数
            default:null,
            type:cc.Label
        },
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },

    },
    // use this for initialization
    onLoad: function () {
        this.creatNodePool();
        this.curPageNum = 1;//默认当前页
        this.allPageNum = 10;//默认总页数
        this.isLoading = false;//默认不在加载中
        this.nextBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.nextPage();
        },this);
        this.preBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.prePage();
        },this);
    },
    creatNodePool(){//创建日志item列表对象池
        this.logItemArray = [];
    },
    renderLogList(){//渲染日志列表
        var itemLen = this.logItemBox.getChildren().length;
        for(var l = 0;l<itemLen;l++){
            this.logItemArray.push(this.logItemBox.getChildren()[l]);
        }
        cc.log(this.logItemArray.length,"对象数组长度1");
        this.logItemBox.removeAllChildren();
        this.getLogData();
    },
    getLogData(){//得到日志数据
        this.isLoading = true;
        this.getComponent('ReqAni').showReqAni();
        Net.get('/api/game/log/list',1,null,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else if(!data.obj||data.obj.records<=0){
                this.showLittleTip('没有数据');
            }else{
                var logItem = null;
                var recs = data.obj.records;
                for(var i = 0;i<recs.length;i++){
                    if(this.logItemArray.length>0){
                        logItem = this.logItemArray.shift();
                    }else{
                        logItem = cc.instantiate(this.logItemPre);
                    }
                    this.logItemBox.addChild(logItem);
                    logItem.getComponent('SetLogItem').setItem('06/05',i,'被打',i);
                }
                this.allPage.string = data.obj.pages;
                this.allPageNum = data.obj.pages;
                this.cuurentPage.string = data.obj.current;
            }
            this.isLoading = false;
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this),function(data){
            this.isLoading = false;
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this));
    },
    nextPage(){
        if(this.curPageNum>=this.allPageNum){
            this.showLittleTip('没有下一页了');
            return
        };
        this.curPageNum++;
        this.renderLogList();
    },
    prePage(){
        if(this.curPageNum<=1){
            this.showLittleTip('没有上一页');
            return
        };
        this.curPageNum--;
        this.renderLogList();
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.renderLogList()
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});