KangoAPI.onReady(function () {
	var storage = kango.storage;
	var area = document.getElementById('config');

	area.value = storage.getItem('editorconfig');

	function store() {
		storage.setItem('editorconfig', area.value);
	}

	var lastTimeout = 0;

	area.addEventListener('keyup', function () {
		clearTimeout(lastTimeout);
		lastTimeout = setTimeout(store, 100);
	});
});