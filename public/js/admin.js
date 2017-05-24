/**
 * Created by lailai on 2017/4/19.
 */
// 处理删除电影数据的逻辑
$(function(){
   $('.del').click(function(e){
       var target=$(e.target);
       var id=target.data('id');
       var tr=$('.item-id-'+id);
       $.ajax({
          type: 'DELETE',
           url: '/movie/list?id='+id
       })
       .done(function(results){
          if(results.success==1)
          {
              if(tr.length>0)
              {
                  tr.remove();
              }
          }
       });
   });
});