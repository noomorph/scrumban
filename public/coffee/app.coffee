ITEM_STATUSES = ['backlog', 'selected', 'work', 'done', 'qa', 'staging', 'live']

class Item
	constructor: (o) ->
		$.extend(@, o)
		@deleted = ko.observable(false)

	delete: =>
		@deleted(true)
		board.save()

class Project
	constructor: (options = {}) ->
		getItems = (arr = []) ->
			arr = arr.filter (i) -> !i.deleted
			ko.observableArray(arr.map (i) -> new Item(i))

		@id = options.id
		@name = options.name
		@color = options.color || 'none'
		ITEM_STATUSES.forEach (s) => @[s] = getItems(options[s])
	
class Board
	constructor: ->
		@projects = ko.observableArray()
		@query = ko.observable()
		@socket = io.connect('/')
		@socket.on 'error', @onerror
		@socket.on 'load', @load
		@socket.on 'issues', @issues

	itemRenderer: (ul, item) ->
		$("<li class=\"ui-menu-item\"><a href=\"#\">
	<img src=\"#{item.icon}\" title=\"#{item.status}\" alt=\"#{item.status}\" />
	<b>#{item.id}</b>: #{item.summary}
	</a></li>").appendTo(ul)

	onerror: (e) ->
		console.error(e)

	load: (projects = "[]") =>
		localStorage.setItem 'board', projects
		@projects(JSON.parse(projects).map (p) -> new Project(p))
		@initHandlers()

	save: =>
		console.log "save"
		_new = ko.mapping.toJSON @projects()
		_old = localStorage.getItem('board')

		if (_new != _old)
			localStorage.setItem('board', _new)
			@socket.emit 'save', _new

	search: (query, callback) =>
		if query?.term
			@socket.emit 'query', query.term
			@socket.on 'results', callback

	addItem: (e, ui) =>
		projects = @projects()
		if (projects.length > 0)
			item = new Item(ui.item)
			item.deleted.subscribe => @save()
			projects[0].backlog.push(item)
			@save()

	initHandlers: =>
		@projects().forEach (p) =>
			ITEM_STATUSES.forEach (s) =>
				p[s].subscribe => @save()

		$("#search").autocomplete
			source: @search
			select: @addItem
			minLength: 2
		.data('ui-autocomplete')._renderItem = @itemRenderer

@board = new Board()
ko.applyBindings @board
