$(document).ready(function(){
	
	var vk_fetch_api_base_url = 'https://vk.api.fabmarket.ru/api/last_posts';
	var tomita_api_base_url   = 'https://tomita.demo.fabmarket.ru/api/check_text';
	
	$('#vk_group_submit_btn').click(function(){
	
		var group_url = $('form#main_form').serializeObject().vk_group_link;
		$.get( vk_fetch_api_base_url, { group: group_url, days: 7 }, function(data) {
			console.log(data);
			
			// $.each(data.items, function(i, post_text) {
			// 	var $row = $('<div class="row">').append(
			// 		$('<div class="col-5">').text(post_text),
			// 		$('<div class="col-5">').append('<xmp>Data extract</xmp>'),
			// 		$('<div class="col-2">').append('<xmp>Комментарий</xmp>'),
			// 	).appendTo('div#data_inspection_area');
			// });
			
			$.each(data.items, function(i, post_text) {
				var $row = $('<tr>').append(
					$('<td>').addClass("col-5 original-data").text(post_text),
					$('<td>').addClass("col-5 data-edit"),
					$('<td>').addClass("col-2").append('<form><textarea>Комментарий по качеству распознавания</textarea></form>'),
				).appendTo('div#data_inspection_area tbody');
			});
			
			$( ".data-edit" ).load( "event_edit_form.html" );
			
		});
	});
	
	$('#tomita_submit_btn').click(function(){
		
		$('tr').each(function() {
			var tr = $(this);
			var text = tr.find('td.original-data').first().text();
			$.post( tomita_api_base_url, { text: text }, function(data) {
				
				console.log(data);
				
				var event_start = $.grep( data, function( n ) {
  					return n.type == 'Date';
				});
				if ( event_start.length > 0 ) {
					console.log("event_start found", event_start);
					event_start = event_start[0].values;
					tr.find('td.data-edit input.event_start').first().val(event_start.Day + ' ' + event_start.Month);
				}
				
				var event_location = $.grep( data, function( n ) {
  					return n.type == 'Address';
				});
				if ( event_location.length > 0 ) {
					console.log("event_location found", event_start);
					event_location = event_location[0].values;
					tr.find('td.data-edit input.event_location').first().val(event_location.Descr + ' ' + event_location.StreetName);
				}
			});
		});	
	});	
});