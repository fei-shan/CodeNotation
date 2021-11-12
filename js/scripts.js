const annotations = [
    {
        "id": 1,
        "thought": "This must be correct",
        "class": "btn btn-success w-100",
    },
    {
        "id": 2,
        "thought": "This should be used",
        "class": "btn btn-success w-100",
    },
    {
        "id": 3,
        "thought": "It worth a try",
        "class": "btn btn-success w-100",
    },
    {
        "id": 4,
        "thought": "Looking up/into it",
        "class": "btn btn-success w-100",
    },
    {
        "id": 5,
        "thought": "Testing it",
        "class": "btn btn-success w-100",
    },
    {
        "id": 6,
        "thought": "Stuck on this",
        "class": "btn btn-success w-100",
    },
    {
        "id": 7,
        "thought": "What should I do now?",
        "class": "btn btn-success w-100",
    },
    {
        "id": 8,
        "thought": "Other",
        "class": "btn btn-success w-100",
    },
    {
        "id": 9,
        "thought": "Feeling good",
        "class": "btn btn-success w-50",
        "color": "LightSeaGreen",
    },
    {
        "id": 0,
        "thought": "Feeling bad",
        "class": "btn btn-success w-50",
        "color": "LightSalmon",
    }
];

var annotation_time_total = 40;
var annotation_time_left = annotation_time_total;

$(document).ready(function (){
    displayAnnotation();
    getSelection();
    startCountdown();
    makeAnnotation();
    closeToast();
    keyboardOverride();
});

function closeToast() {
    $("#toast-content .btn-close").click(function (){
        $("#toast-content #toast").hide();
    })
}

// Style each annotation button
function styleAnnotation(a) {
    $("div#annotation #" + a.id).css({
        "background-color": a.color,
        "border": a.color,
    }).hover( function () {
        $(this).css({
            "background-color": a.color,
            "border": a.color,
        })
    });
}

// Display annotation button options.
function displayAnnotation() {
    for (const a of annotations) {
        $("#annotation").append("<button id=\""+ a.id +
                "\" class = \"" + a.class + "\">" +
            a.id + ". " + a.thought +
            "</button>");
        styleAnnotation(a);
    }
}

// Get selected text
var selection = "";
function getSelection() {
    selection = document.getSelection();
}

// Monitor text selection
// function monitorSelection() {
//     $("div#annotation button").mouseup(getSelection);
// }

// Start countdown once
var reset_time = false;
function startCountdown () {
    $("textarea#code").one("focus", function (event) { // Start countdown
        $("div#countdown-timer div.progress-bar") // Reset to full width, then start counting down again.
            .width("100%")
            .attr("aria-valuenow", 100).hide().show(0, true, function () {
                reset_time = false
            countdown(annotation_time_left, annotation_time_total);
        });
    })
}

// Handle button click and keyboard shortcut
function handleAnnotation(a) {
    console.log({"thought": a.text(), "content":selection.toString()});

    // Display toast
    $("#toast-content .toast-body").text(a.text()
        + ": " + selection.toString());
    $("#toast-content #toast").show().delay(1000).fadeOut();

    // Timer reset
    reset_time = true;
    $("div#countdown-timer div.progress-bar").stop(true, true); // Stop animation
}

// Make annotation of text selection
function makeAnnotation() {
    $("div#annotation button").click(function(event) {
        event.stopPropagation();
        // Get corresponding annotation button
        let a = $(this);
        handleAnnotation(a);
    });
}

function countdown(left, total) { // Recursive count in seconds
    if (reset_time) { // Reset to full
        // $("div#countdown-timer div.progress-bar")
        //     .addClass(".notransition");
        $("div#countdown-timer div.progress-bar") // Reset to full width, then start counting down again.
            .width("100%")
            .attr("aria-valuenow", 100).hide().show(0, true, function () {
                reset_time = false
                countdown(total, total);
        });
    } else if (left > 0) {
        let width = left / total;
        $("div#countdown-timer div.progress-bar")
            .width(width * $("div#countdown-timer").width())
            // .animate({ width: width * $("div#countdown-timer").width()}, 200)
            .attr('aria-valuenow', Math.floor(100 * width));
            // .html(Math.floor(left/60) + ":"+ left%60);
        setTimeout(function() { // Update every 0.5 second
            countdown(left - 0.1, total);
        }, 100);
    } else {
        alert("Please make an annotation to continue");
        // Restart countdown when the editor is focused
        startCountdown();
    }
}

function range(start, stop, step=1) {
    return new Array((stop - start)/step).fill(start).map((d, i) => step * i + start);
}

function keyboardOverride() {
    // Tab support for code editor
    $("textarea#code").tabby();

    // Keyboard annotation short cut
    $(document).keypress(function(event) {
        let key_codes = range(48, 58); // key 0 to key 9
        if((event.metaKey || event.ctrlKey)
            && key_codes.includes(event.keyCode)) {
            event.preventDefault();
            // Get corresponding annotation button
            let a = $("div#annotation button#" + key_codes.indexOf(event.keyCode));
            handleAnnotation(a);
        }
    });
}

// Submit skulpt code
function outf(text) {
    // let output = document.getElementById("output");
    // output.innerHTML = output.innerHTML + text;
    let output = $("pre#output");
    output.html(output.html() + text);
}


function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

// Run the code in editor
function runPythonCode() {
    // let code = document.getElementById("code").value;
    // let output = document.getElementById("output");
    // output.innerHTML = '';
    let code = $("textarea#code").val();
    let output = $("pre#output");
    output.html("");
    Sk.pre = "output";
    Sk.configure({output:outf, read:builtinRead});
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
    let myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, code, true);
    });
    myPromise.then(function(mod) {
       console.log('success');
    },
       function(err) {
       console.log(err.toString());
    });
}
