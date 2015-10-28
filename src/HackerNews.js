/*
 * This represents the HackerNews website
 */

module.exports = (function(){  

  var ajax = require('ajax');

  var HackerNews = function() {
    // API Endpoints to access
    
    // top stories listing
    this.URL_TOPSTORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    
    // Item prefix (followed by "[item number].json")
    this.URL_ITEM       = 'https://hacker-news.firebaseio.com/v0/item/';
    
    // Top stories list
    this.top = [];
    // Cache for stories we have downloaded
    this.cache = [];
  
  };
  
  HackerNews.prototype.getTopStories = function(callback) {
    var HN = this;
    ajax({
        url: HN.URL_TOPSTORIES,
        type: 'json'
      },
      // Success
      function (data) {
        if (Array.isArray(data)) {
          HN.top = data;
          callback();
        } else {
          console.log('failed to get stories');
        }
      },
      // Error
      function (error) {
        console.log('failed to get stories: ' + error);
    }); // ajax()
  };
  
  HackerNews.prototype.getStory = function(top_story_index, callback) {
    var story_id = this.top[top_story_index];
    // If in cache
    if (this.cache[story_id]) {
      // Callback if it is set
      if (callback) {
        callback(this.cache[story_id]);
      }
    // If not in cache
    } else {
      var HN = this;
      // Attempt to download story
      ajax({
          url: HN.URL_ITEM + story_id + '.json',
          type: 'json'
        },
        // Success
        function(data) {
          // Save to the cache
          HN.cache[story_id] = data;
          // Callback if it is set
          if (callback) {
            callback(HN.cache[story_id]);
          }
        },
        // Error
        function(error) {
          console.log('failed to get story: ' + error);
      });
    } // else
  };
  
  HackerNews.prototype.getStories = function(current, max, callback) {
    var HN = this;
    if (current == max) {
      if (callback) {
        callback();
      }
      return;
    }
    this.getStory(current, function() {
      current++;
      HN.getStories(current, max, callback);
    });
  };
  
  HackerNews.prototype.refreshStories = function(callback) {
    var HN = this;
    this.getTopStories(function() {
      HN.getStories(0, 25, callback);
    });
  };
  
  return HackerNews;
  
})();