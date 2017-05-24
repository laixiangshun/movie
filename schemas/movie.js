/**
 * Created by lailai on 2017/4/19.
 */
var mongoose=require('mongoose')
var movieSchema=new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    // meta 更新或录入数据的时间记录
    meta:{
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
// movieSchema.pre 表示每次存储数据之前都先调用这个方法
movieSchema.pre('save',function(next){
    if(this.isNew)
    {
        this.meta.createAt=this.meta.updateAt=Date.now
    }else
    {
        this.meta.updateAt=Date.now()
    }
    next();
})
// movieSchema 模式的静态方法
movieSchema.statics={
    fetch: function(cd){
      return this.find({}).sort('meta.updateAt')
      .exec(cd)
    },
    findById: function(id,cd)
    {
        return this.findOne({_id: id})
        .exec(cd)
    }
}
// 导出movieSchema模式
module.exports=movieSchema;