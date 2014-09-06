var notes = Alloy.Collections.notes;
var args = arguments[0] || {};
$.textArea.value = args.selected;

if (OS_IOS) {
    var done = Ti.UI.createButton({
        title : 'Done'
    });

    done.addEventListener('click', function(e) {
        if ($.textArea.value) {
            // Edit note
            edit();

            // Close window
            $.editWin.close();
        } else {
            alert("Write something!");
        }
    });

    // Create button on Navigation Bar
    $.editWin.rightNavButton = done;
}

if (OS_ANDROID) {
    $.editWin.addEventListener('open', function(e) {
        var activity = $.editWin.activity;

        // Create menu button "Done"
        activity.onCreateOptionsMenu = function(e) {
            var menu = e.menu;
            var menuItem = menu.add({
                title : "Done",
                showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
            });
            menuItem.addEventListener("click", function(e) {

                if ($.textArea.value) {
                    // Save note
                    edit();

                    // Close window
                    $.editWin.close();
                } else {
                    alert("Write something!");
                }
            });
        };

        activity.actionBar.title = "Edit note";
        activity.actionBar.displayHomeAsUp = true;

        // Close window when home icon clicked
        activity.actionBar.onHomeIconItemSelected = function() {
            $.editWin.close();
        };
    });
}

//
function edit() {
    // Only updates the note if it has been modified
    if ($.textArea.value !== args.selected) {
        var newModel = Alloy.createModel('notes', {
            note : args.selected
        });
        // Update the note
        for (var i = 0; i < notes.models.length; i++) {
            if (notes.models[i].get('note') === newModel.get('note')) {
                notes.models[i].set({
                    note : $.textArea.value,
                    date_created : moment().format("MM-DD-YYYY"),
                    date_modified : moment().calendar(moment().format("MM-DD-YYYY"))
                });
                notes.models[i].save();
            }
        }
        notes.fetch();
    }
}