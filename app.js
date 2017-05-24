/**
 * Created by lailai on 2017/4/18.
 */
var express=require('express');
// 引入path模块的作用：因为页面样式的路径放在了bower_components，告诉express，请求页面里所过来的请求中，
// 如果有请求样式或脚本，都让他们去bower_components中去查找
var path=require('path');
var port=process.env.PORT || 3000;
var app=express();// 启动Web服务器

// 加载mongoose模块
var mongoose=require('mongoose');
// 连接mongodb本地数据库movie
mongoose.connect('mongodb://localhost/movie');
console.log('mongodb connect successful');
// 载入mongoose编译后的模型movie
var movie=require('./models/movie.js');

app.set('views','./views/pages');   // 设置视图默认的文件路径
app.set('view engine','jade');// 设置视图引擎：jade

//// 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
//app.use(express.bodyParser())
var bodyParse=require('body-parser');
app.use(bodyParse.urlencoded({extended:true}));

//app.use(express.static(path.join(_dirname,'bower_components')))
var serveStatic = require('serve-static');  // 静态文件处理
app.use(serveStatic('public'));

// 载入moment模块，格式化日期
app.locals.moment=require('moment');
app.listen(port);
console.log('imooc started on port'+ port);

// _.extend用新对象里的字段替换老的字段
var underscore=require('underscore');
// 编写主要页面路由
//index page
app.get('/',function(req,res){
    movie.fetch(function(err,movies){
        if(err)
        {
            console.log(err);
        }
        res.render('index',{
            title: 'movie 首页',
            movies: movies
        })
    })
});
//datail page
app.get('/movie/:id',function(req,res){
    var id=req.params.id;
    movie.findById(id,function(err,movie){
        res.render('detail',{
            title: 'movie' + movie.title,
            movie: movie
        })
    })
});
//admin page
app.get('/admin/movie',function(req,res){
    res.render('admins',{
        title: 'movie 电影录入页',
        movie: {
            doctor: '',
            title: '',
            language: '',
            country: '',
            summary: '',
            flash: '',
            poster: '',
            year: ''
        }
    });
});
//admin update movie
app.get('/admin/update/:id',function(req,res){
   var id=req.params.id;
    if(id)
    {
        movie.findById(id,function(err,movies){
            if(err)
            {
                console.log(err);
            }
            res.render('admins',{
                title:'movie后台更新页',
                movie: movies
            });
        });
    }
});
//admin movie post
app.post('/admin/movie/new',function(req,res){
    var id=req.body.movie._id;
    var movieobj=req.body.movie;
    var _movie=null;
    if(id !=='undefined')
    {
        movie.findById(id,function(err,movie){
           if(err)
           {
               console.log(err);
           }
            _movie=underscore.extend(movie,movieobj);
            _movie.save(function(err,movie){
                if(err)
                {
                    console.log(err);
                }
                res.redirect('/movie/'+movie._id);
            });
        });
    }else
    {
        _movie=new movie({
            doctor: movieobj.doctor,
            title: movieobj.title,
            country: movieobj.country,
            language: movieobj.language,
            year: movieobj.year,
            poster: movieobj.poster,
            summary: movieobj.summary,
            flash: movieobj.flash
        })
        _movie.save(function(err,movie){
            if(err)
            {
                console.log(err);
            }
            res.redirect('/movie/'+movie._id);
        });
    }
});
//list page
app.get('/admin/list',function(req,res){
    movie.fetch(function(err,movies){
        if(err)
        {
            console.log(err);
        }
        res.render('list',{
            title: 'imooc 列表页',
            movies: movies
        })
    })
});
//list item delete movie
app.delete('/movie/list',function(req,res){
    var id=req.query.id;
    if(id)
    {
        movie.remove({_id: id},function(err,movie){
           if(err)
           {
               console.log(err);
               res.json({success: 0});
           }
            else{
               res.json({success: 1});
           }
        });
    }else
    {
        res.json({success: 0});
    }
});