//global
window.Global={
    layer:null,//弹框遮罩层
    conLayer:null,//确认框遮罩层
    layerRecharge:null,//充值弹出层遮罩
    conDia:null,//确认对话框
    goodsDesc:null,//物品详细信息展示介绍
    openAction:cc.sequence(cc.scaleTo(0.1, 1.2, 1.2),cc.scaleTo(0.1, 1, 1)),//窗口打开动作
    openAudio:true,//是否打开音效
    openBgMusic:false,//是否打开背景音乐
    hasTreesProp:true,//是否有树苗
    hasWatersProp:true,//是否有甘露
    hasBugsProp:true,//是否有除虫剂
    hasGrassProp:true,//是否有除草剂
    isShowHeader:true,//是否显示头部
};
