ITEM_STATUSES = ['backlog', 'selected', 'work', 'done', 'qa', 'live']
ITEM_FIELDS = ["summary", "priority", "status", "assignee", "description"]

config = require('./config')
JiraApi = require('jira').JiraApi
jira = new JiraApi('https',
	config.host, config.port,
	config.user, config.password,
	'latest', true, true)
opts =
	fields: ITEM_FIELDS
	maxResults: 10

mapper = (err, body) ->
	return { err: err, body: body } if err
	json = body.issues.map (issue) ->
		fields = issue.fields
		item =
			id: issue.key
			summary: fields.summary
			status: fields.status.name
			description: fields.description
			icon: fields.priority.iconUrl
			priority: fields.priority.name
			assignee: fields.assignee?.displayName || 'Unassigned'
	{ body: json }

exports.refresh = (projects, callback) ->
	ids = []
	ITEM_STATUSES.forEach (s) ->
		projects.forEach (p) ->
			p[s].forEach (t) ->
				ids.push(t.id)
	jql = "issuekey in (#{ids.join(', ')})"
	o = { fields: opts.fields, maxResults: ids.length }
	jira.searchJira jql, o, (err, body) ->
		res = mapper(err, body)
		# callback(res.err, res.body)

exports.search = (term, callback) ->
	if (term.match(/\w+-\d+/))
		jql = "issuekey = #{term}"
	else
		jql = "summary ~ \"#{term}\""

	jira.searchJira jql, { fields: fields, maxResults: 10 }, (err, body) ->
		map = mapper(err, body)
		callback(map.err, map.body)
