$('document').ready(function(){

 const page_name = mw.config.get('wgPageName')

 if(!page_name.includes('பக்கம்:'))
  return

 const icon_box = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Think_Outside_the_Box_Idea_Flat_Icon_Vector.svg/640px-Think_Outside_the_Box_Idea_Flat_Icon_Vector.svg.png"

 const icon_line = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Simpleicons_Business_line-graphic-with-two-lines.svg/640px-Simpleicons_Business_line-graphic-with-two-lines.svg.png"

 const images = $("<div></div>")

 const box_tag = $("<img src='"+icon_box+"' height='40' width='40' style='margin-left:3px'>")

 const line_tag = $("<img src='"+icon_line+"' height='30' width='30' style='margin-left:3px'>")

 box_tag.click(function(){ getDataAndSend() })
 line_tag.click(function(){ makeTwoLine() }) 

 images.append(box_tag)
 images.append(line_tag)

 $(images).insertAfter('#firstHeading')
})

function twoLineMaker(text){
 const data = text.replace('</noinclude>', '</noinclude>\n\n')
 return data
}

function makeTwoLine(){
 $.getJSON(
	mw.util.wikiScript('api'),
	{
		format: 'json',
		action: 'query',
		prop: 'revisions',
		rvprop: 'content',
		rvlimit: 1,
		titles: mw.config.get('wgPageName')
	}
)
	.done(function ( data ) {
		var page, wikitext;
		try {
			for ( page in data.query.pages ) {
				wikitext = data.query.pages[page].revisions[0]['*'];
                //console.log(wikitext)
                const clean_text = twoLineMaker(wikitext)
                performAjax(clean_text)
				
			}
		} catch ( e ) {
			console.log('error')
		}
	})
	.fail( console.log('fail'));

}

function textCleanerForBox(text){
 let output = text.replace('</noinclude> ', '</noinclude>').replace(/\n /g, '\n')
 return output
}

function getDataAndSend(){
 $.getJSON(
	mw.util.wikiScript('api'),
	{
		format: 'json',
		action: 'query',
		prop: 'revisions',
		rvprop: 'content',
		rvlimit: 1,
		titles: mw.config.get('wgPageName')
	}
)
	.done(function ( data ) {
		var page, wikitext;
		try {
			for ( page in data.query.pages ) {
				wikitext = data.query.pages[page].revisions[0]['*'];
                console.log(wikitext)
                const clean_text = textCleanerForBox(wikitext)
                performAjax(clean_text)
				
			}
		} catch ( e ) {
			console.log('error')
		}
	})
	.fail( console.log('fail'));
}

function performAjax(data) {
 editPage({
	title: mw.config.get('wgPageName'),
	text: data,
	summary: 'editing page ' + mw.config.get('wgPageName')
 });
}

function seePageThrow(){
 window.location.assign("https://ta.wikisource.org/wiki/"+mw.config.get('wgPageName'))
}

function editPageThrow(){
 window.location.assign("https://ta.wikisource.org/w/index.php?title="+ mw.config.get('wgPageName') + "&action=edit")
}

function redirectionPage(){
 let floater = "<div style='border: dodgerblue solid 2px; border-radius: 4px; position:absolute, top: 10px, left:calc(100% - 200px);height: 200px;width: 300px;position: fixed;top: 10px;left: calc( 50% - 150px);background-color: white;z-index: 1000; display:flex; justify-content:center; align-items:center'><input type='button' class='floater-btn' value='பார்க்க' onclick='seePageThrow()'/><input class='floater-btn' onclick='editPageThrow()' type='button' value='தொகு' /></div>"
 
 $('body').prepend(floater)

 $('.floater-btn').css({margin:'5px', backgroundColor:'dodgerblue', color: 'white', padding:'5px', fontSize:'large', borderRadius:'4px', border:'none'})
}

function editPage( info ) {
	$.ajax({
		url: mw.util.wikiScript( 'api' ),
		type: 'POST',
		dataType: 'json',
		data: {
			format: 'json',
			action: 'edit',
			title: info.title,
			text: info.text, // will replace entire page content
			summary: info.summary,
			token: mw.user.tokens.get( 'csrfToken' )
		}
	})
	.done (function( data ) {
		if ( data && data.edit && data.edit.result && data.edit.result == 'Success' ) {
			//alert( 'Page edited!' );
            console.log('success')
		} else {
			alert( 'error occured' );
		}
        //window.location.assign("https://ta.wikisource.org/wiki/"+info.title)
        redirectionPage()
	})
	.fail ( function() {
		alert( 'The ajax request failed.' );
	});
}

