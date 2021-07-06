importStylesheet('பயனர்:Thiruak1024/magnifier.css')

var magnifiable = false

$(document).ready(function(){
 //var pathname = window.location.href
 var pageName = mw.config.get('wgPageName')
 var condition = pageName.includes('பக்கம்:')

 if(!condition)
  return
 
 let src_img
 if($('img.ui-draggable').length > 0){
  src_img = "https:" + $('img.ui-draggable').attr('src')
 }else{
  src_img = $('div.prp-page-image')[0].firstChild['src']
 }
 const before = '<div id="magnifier-main"><div class="magnifier"><div class="large"></div><img class="small" src="'+src_img+'" height="100%"/></div></div>'
 $('body').prepend(before)
 $('div.large').css({backgroundImage: 'url(' + src_img + ')', backgroundRepeat: 'no-repeat'});
 nessScript()
})

function nessScript(){
var native_width = 0;
  var native_height = 0;
  $(".magnifier").mousemove(function(e) {
    if (!native_width && !native_height) {
      var image_object = new Image();
      image_object.src = $(".small").attr("src");
      native_width = image_object.width;
      native_height = image_object.height;
    } else {
      var magnify_offset = $(this).offset();
      var mx = e.pageX - magnify_offset.left;
      var my = e.pageY - magnify_offset.top;

      if (mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0) {
        $(".large").fadeIn(100);
      } else {
        $(".large").fadeOut(100);
      }
      if ($(".large").is(":visible")) {
        var rx =
          Math.round(
            mx / $(".small").width() * native_width - $(".large").width() / 2
          ) * -1;
        var ry =
          Math.round(
            my / $(".small").height() * native_height - $(".large").height() / 2
          ) * -1;
        var bgp = rx + "px " + ry + "px";

        var px = mx - $(".large").width() / 2;
        var py = my - $(".large").height() / 2;
        $(".large").css({ left: px, top: py, backgroundPosition: bgp });
      }
    }
  });
}

function showMagnify(){
 magnifiable = !magnifiable
 if(magnifiable)
  $('#magnifier-main').css({display:'flex'})
 else
  $('#magnifier-main').css({display: 'none'})

}

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'z') {
    showMagnify()
  }
});

