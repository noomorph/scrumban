class Item
	constructor: (@id) ->
		@deleted = ko.observable(false)

	delete: ->
		@deleted(true)

class Project
	constructor: (@name) ->
		@klass = @name.toLowerCase()
		@backlog = ko.observableArray([new Item('Task-N')])
		@selected = ko.observableArray()
		@work = ko.observableArray()
		@done = ko.observableArray()
		@qa = ko.observableArray()
		@staging = ko.observableArray()
		@live = ko.observableArray()

viewmodel =
	projects: [
		new Project( 'Project-1' ),
		new Project( 'Project-2' ),
		new Project( 'Project-3' ),
		new Project( 'Other' )
	]

ko.applyBindings viewmodel

# https://jira.sample.com/rest/api/latest/search?jql=project%20%3D%20PROJ1&maxResults=10
