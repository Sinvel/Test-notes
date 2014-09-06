var notes = Alloy.Collections.notes;
var moment = require('alloy/moment');

// This method will update the dates  in relation to the calendar
// it will also help sorting the table
updateDates();
// Reload the notes
notes.fetch();

function erase(e) {
    var task = Alloy.createModel('notes', {
        note : e.source.titleid
    });
    // Destroy the model from persistence, which will in turn remove
    // it from the collection, and model-view binding will automatically
    // reflect this in the tableview
    for (var i = 0; i < notes.models.length; i++) {
        if (notes.models[i].get("note") === task.get("note")) {
            notes.models[i].destroy();
        }
    }
}

function updateDates() {
    for (var i = 0; i < notes.models.length; i++) {
        notes.models[i].set({
            date_modified : moment().calendar(notes.models[i].get("date_created"))
        });
        notes.models[i].save();
    }
}

// Open a window to edit note
function edit(e) {
    var editWin = Alloy.createController('edit', {
        selected : e.source.titleid
    }).getView();
    if (OS_ANDROID)
        editWin.open();
    if (OS_IOS)
        $.navGroupWin.openWindow(editWin);
}

// Avoid auto-focusing the search bar at start
$.searchBar.hide();
setTimeout(function(e) {
    $.searchBar.show();
}, 1000);

// Open main window
if (OS_IOS) {
    Alloy.Globals.navGroupWin = $.navGroupWin;

    var create = Ti.UI.createButton({
        title : 'New'
    });

    create.addEventListener('click', function(e) {
        var createWin = Alloy.createController('create').getView();
        $.navGroupWin.openWindow(createWin);
    });

    // Create button on Navigation Bar
    $.mainWindow.rightNavButton = create;
    $.navGroupWin.open();
}
if (OS_ANDROID) {
    $.aWin.addEventListener('open', function(e) {
        var activity = $.aWin.activity;

        // Button to create a new note
        activity.onCreateOptionsMenu = function(e) {
            var menu = e.menu;
            var menuItem = menu.add({
                title : "New",
                showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
            });
            menuItem.addEventListener("click", function(e) {
                var createWin = Alloy.createController('create').getView();
                createWin.open();
            });
        };

        activity.actionBar.title = "Test Notes";
        activity.actionBar.displayHomeAsUp = false;
    });
    $.aWin.open();
}

function doTransform(model) {
    return model.toJSON();
}