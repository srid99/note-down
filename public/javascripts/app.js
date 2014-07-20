var App = (function() {
    var searchBox;

    var setFocusOnSearchBox = function() {
        searchBox.focus();
    };

    return {
        init: function() {
            searchBox = $("input[name='q']");
            return this;
        },

        bindEvents: function() {
            $(document).bind('keydown', 'Ctrl+Shift+s', setFocusOnSearchBox);
            $(document).bind('keydown', 'Ctrl+Shift+f', setFocusOnSearchBox);
            return this;
        }
    };
})();

$(document).ready(function() {
    App.init().bindEvents();
});
