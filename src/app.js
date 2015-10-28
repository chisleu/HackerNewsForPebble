(function() {
  /**
   * Simple Hacker News headlline viewer
   */
  
  var UI   = require('ui');
  var HackerNews = require('./HackerNews');
  
  /*
   * This represents the application running on the watch
   */
  var Application = function() {
    this.story_card = null;
    this.current = 0;
      
    // Show the splash screen as fast as possible.
    var Splash = new UI.Card({
      title:     'Hacker News',
      subtitle:  'chisleu-hnn @inflam.es',
      body:      "Displays the current top stories at YC's Hacker News."
    });
    
    Splash.show();
      
    this.HN = new HackerNews();
        
    var app = this;
    
    Splash.on('click', 'up', function() {
      app.reset();
    });
    
    Splash.on('click', 'select', function() {
      app.reset();
    });
    
    Splash.on('click', 'down', function() {
      app.reset();
    });
    
    this.load();
  };
  
  Application.prototype.reset = function() {
    this.current = 0;
    var app = this;
    this.HN.refreshStories(function() {
      app.showCurrentStory();
    });
  };
  
  Application.prototype.showStory = function(story) {
    if (this.story_card) {
      this.story_card.hide();
    }
    this.story_card = new UI.Card({
      title: 'Hacker News',
      body: story.title
    });
  
    this.story_card.show();
    this.setupHandlers();
  };
  
  Application.prototype.setupHandlers = function() {
    var app = this;
    this.story_card.on('click', 'up', function(){
      app.showPreviousStory();
    });
    
    this.story_card.on('click', 'select', function() {
      app.current = 0;
      app.load();
    });
    
    this.story_card.on('click', 'down', function() {
      app.showNextStory();
    });
  };
  
  Application.prototype.showCurrentStory = function() {
    var app = this;
    this.HN.getStory(this.current, function(data) {
      app.showStory(data);
    });
  };
  
  Application.prototype.showNextStory = function() {
    if (this.current + 1 < this.HN.top.length) {
      this.current++;
    }
    this.showCurrentStory();
  };
  
  Application.prototype.showPreviousStory = function() {
    if (this.current > 0) {
      this.current--;
    }
    this.showCurrentStory();
  };
  
  Application.prototype.load = function() {
    var app = this;
    app.HN.refreshStories(function() {
      app.showCurrentStory();
    });
  };
  
  new Application();
  
})();