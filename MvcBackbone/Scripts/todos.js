/// <reference path="underscore.js" />
/// <reference path="backbone.js" />

//we are defining a backbone model with the custom method named Todo
Todo = Backbone.Model.extend({
	// Default attributes for the todo.
    defaults: {
      content: "empty todo..."
    },
		// Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content});
      }
    },
	
	url: "home/todos"
});

//Our collection is where models are stored. In this instance we’re specifying the model that the collection contains.
Todos = Backbone.Collection.extend({
	model: Todo,
	url: "home/todos"
});

todos = new Todos();

TodoView = Backbone.View.extend({
	tagName: 'li',
	render: function () {
		var content = this.model.get('content');
		$(this.el).html(content);
		return this;
	}
});

//as soon as app loads, we are creating a custom view class:
TodoFormView = Backbone.View.extend({
	initialize: function () {
		this.template = $("#formTemplate");
	},
	events: {
		"submit #todo-form": "save"
	},
	render: function () {
		var content = this.template.tmpl();
		$(this.el).html(content);
		return this;
	},
	save: function () {
		var val = this.$("input").val();
		var model = new Todo({ content: val });
		model.save();
		this.$("input").val('');
	}
});

TodoItemView = Backbone.View.extend({
	tagName: 'li',
	initialize: function () {
		this.template = $("#item-template");
		_.bindAll(this, "render");
	},
	render : function(){
		//render the jQuery template
		var content = this.template.tmpl(this.model.toJSON());
		//take the rendered HTML and pop it into the DOM
		$(this.el).html(content);
		return this;
	}
});

TodoListView = Backbone.View.extend({
	initialize: function () {
		_.bindAll(this, "render");
		this.collection.bind("change", this.render);
		this.collection.bind("add", this.render);
		this.collection.bind("fetch", this.render);

		todos.fetch({ add: true });
		
	},
	render: function () {
		//clear out the existing list to avoid "append" duplication
		$(this.el).empty();
		//use an array here rather than firehosing the DOM
		//perf is a bit better
		var els = [];
		//loop the collection...
		this.collection.models.forEach(function (todo) {
			//rendering a view for each model in the collection
			var view = new TodoItemView({ model: todo });
			//adding it to our array
			els.push(view.render().el);
		});
		//push that array into this View's "el"
		$(this.el).append(els);
		return this;
	}
});

TodoList = Backbone.Router.extend({
	initialize: function () {
		todoFormView = new TodoFormView({ collection: todos, el: "#todo-form" });
		todoListView = new TodoListView({ collection: todos, el: "#todo-list" });
	},
	routes: {
		"": "index"
	},
	index: function () {
		//todoListView.render();
		todoFormView.render();
	}
});

$(function () {
	//create the router...
	app = new TodoList();
	//start recording browser history. Although we don't have that need
	//since we don't navigate between routes
	Backbone.history.start();
});
