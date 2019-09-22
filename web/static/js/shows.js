function followSearch() {
	if ($('#follow_search').val()) {
		getRequest(
			'/shows/search',  // shows_search
			{ 'search':$('#follow_search').val() },
			function(data) {
				compileHandlebars('search-result-template', '#follow_search_result', data);
				$('#follow_search_result').removeClass('hidden').html(s_html);
				$('.search-result').on('click', function() {
					followShow(
						$(this).datta().tvdb_id,
						$(this).data().name
					);
				});
			}
		);
	}
}

function getShows() {
	getRequest(
		'/shows/list',  // shows_list
		{},
		function(data) {
			compileHandlebars('show-template', '#content', data);
			$('#followed').text('('+data.shows.length+')');
		}
	);
}

function unfollowShow(tvshowid) {
	postRequest(
		'/shows/unfollow',  // shows_unfollow
		{tvshowid: tvshowid},
		function() {
			showSuccess('Successfully removed.');
			row.remove();
		}
	);
}

function followShow(tvdb_id, name) {
	postRequest(
		'/shows/follow',  // shows_follow
		{ tvdb_id: tvdb_id, name: name },
		function() {
			getShows();
			showSuccess('Successfully added.');
			$('#follow_search').val('').focus();
		}
	);
}

$('#content').on('click', '.confirm_remove', function() {
	var tvshowid = $(this).closest('.show').data().tvshowid;
	unfollowShow(tvshowid);
});

$('#content').on('click', '.remove_show', function() {
	var row = $(this).closest('.show');
	$(this).slideToggle(500);
	row.find('.confirm_remove').slideToggle(500);
});

$('#followModal').on('shown.bs.modal', function() {
	$('#follow_search').focus();
});

$('#followModal').on('hidden.bs.modal', function() {
	$('#follow_search').val('');
	$('#follow_search_result').addClass('hidden').empty();
});

$('#follow_search_submit').on('click', followSearch);

$('#follow_search').on('keyup', function(e) {
	if (e.keyCode == 13) followSearch();
});

$(document).ready(getShows);