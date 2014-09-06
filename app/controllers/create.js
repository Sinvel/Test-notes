var moment = require('alloy/moment');
var notes = Alloy.Collections.notes;

if (OS_IOS) {
    var done = Ti.UI.createButton({
        title : 'Done'
    });

    done.addEventListener('click', function(e) {
        if ($.textArea.value) {
            // Save note
            addToCollection();

            // Close window
            $.createWin.close();
        } else {
            alert("Write something!");
        }
    });

    // Create button on Navigation Bar
    $.createWin.rightNavButton = done;
}

if (OS_ANDROID) {
    $.createWin.addEventListener('open', function(e) {
        var activity = $.createWin.activity;

        activity.onCreateOptionsMenu = function(e) {
            var menu = e.menu;
            var menuItem = menu.add({
                title : "Done",
                showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
            });
            menuItem.addEventListener("click", function(e) {
                if ($.textArea.value) {
                    // Save note
                    addToCollection();
                } else {
                    alert("Write something!");
                }
            });
        };

        activity.actionBar.title = "New note";
        activity.actionBar.displayHomeAsUp = true;

        // Close window when home icon clicked
        activity.actionBar.onHomeIconItemSelected = function() {
            $.createWin.close();
        };
        $.textArea.focus();
    });
}

function addToCollection() {
    // Boolean to check if the new note already exists
    var exists = false;
    // Model for comparing purpouses
    var newModel = Alloy.createModel('notes', {
        note : $.textArea.value
    });

    for (var i = 0; i < notes.models.length; i++) {
        if (notes.models[i].get('note') === newModel.get('note')) {
            exists = true;
        }
    }

    // If exists, send an alert
    if (exists) {
        alert("This note already exists");
    } else {
        // Create
        var task = Alloy.createModel('notes', {
            note : $.textArea.value,
            date_created : moment().format("MM-DD-YYYY"),
            date_modified : moment().calendar(moment().format("MM-DD-YYYY"))
        });

        // Add new model to the global collection
        notes.add(task);

        // Save the model to persistent storage
        task.save();

        // Reload the tasks
        notes.fetch();

        // Close window
        $.createWin.close();
    }
}
