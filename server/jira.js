/* global exports, require */

var ITEM_FIELDS, ITEM_STATUSES, JiraApi, cfg, jira, dto_mapper, opts;

ITEM_STATUSES = ['backlog', 'selected', 'work', 'done', 'qa', 'staging', 'live'];
ITEM_FIELDS = ["summary", "priority", "status", "assignee", "description"];

cfg = require('./config');
JiraApi = require('jira').JiraApi;
jira = new JiraApi(
	cfg.protocol, cfg.host, cfg.port,
	cfg.user, cfg.password,
	cfg.api, cfg.verbose, cfg.ssl);

opts = {
	fields: ITEM_FIELDS,
	maxResults: 10
};

dto_mapper = function(err, body) {
	var json;
	if (err) {
		return {
			err: err,
			body: body
		};
	}
	json = body.issues.map(function(issue) {
		var fields = issue.fields;
		fields.assignee = fields.assignee || {};

		return {
			id: issue.key,
			summary: fields.summary,
			status: fields.status.name,
			description: fields.description,
			icon: fields.priority.iconUrl,
			priority: fields.priority.name,
			assignee: fields.assignee.displayName || 'Unassigned'
		};
	});
	return {
		body: json
	};
};

function getIssueKeys(projects) {
	var ids = [];
	ITEM_STATUSES.forEach(function(s) {
		projects.forEach(function(p) {
			var issues = p[s];
			issues.forEach(function (issue) {
				ids.push(issue.id);
			});
		});
	});
	return ids;
}

function fetchIssues(ids, callback) {
	if (ids.length < 1) {
		return;
	}
	var jql = "issuekey in (" + (ids.join(', ')) + ")";
	jira.searchJira(jql, {
		fields: opts.fields,
		maxResults: ids.length
	}, function(err, body) {
		var dto = dto_mapper(err, body);
		callback(dto.err, dto.body);
	});
}

exports.refresh = function(projects) {
	var ids = getIssueKeys(projects);
	fetchIssues(ids, function (err, issues) {
		if (err) return;
		return issues; // STUB
	});
};

exports.search = function(term, callback) {
	var jql;
	if (term.match(/\w+-\d+/)) {
		jql = "issuekey = " + term;
	} else {
		jql = "summary ~ \"" + term + "\"";
	}
	return jira.searchJira(jql, opts, function(err, body) {
		var dto = dto_mapper(err, body);
		return callback(dto.err, dto.body);
	});
};
