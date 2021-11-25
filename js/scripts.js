const KEYBOARD_SHORTCUT_ENABLED = true;
const PYTHON_ERROR_MESSAGE_DISPLAY = true;

const annotations = [
    {
        "idx": 1,
        "thought": "This must be correct",
    },
    {
        "idx": 2,
        "thought": "This should be used",
    },
    {
        "idx": 3,
        "thought": "It worth a try",
    },
    {
        "idx": 4,
        "thought": "Looking up/into it",
    },
    {
        "idx": 5,
        "thought": "Testing it",
    },
    {
        "idx": 6,
        "thought": "Stuck on this/Debugging",
    },
    {
        "idx": 7,
        "thought": "This could be wrong",
    },
    {
        "idx": 8,
        "thought": "Other",
    },
    {
        "idx": 9,
        "thought": "Feeling good",
    },
    {
        "idx": 0,
        "thought": "Feeling bad",
    }
];

const questions = [
    {
        "idx" : 1,
        problem_detail: "Fibonacci's sequence is a sequence of numbers where every number is the sum of the previous two numbers, starting with 0, 1, 1, ... Given an integer input n, please write a function to calculate and return the nth Fibonacci number.",
        pre_code: "# For testing your function\n" +
            "print(Fibonacci(9))",
    },
    {
        "idx" : 2,
        problem_detail: "Write a function called count_capital_consonants. This function should take as input a string, and return as output a single integer. The number the function returns should be the count of characters from the string that were capital consonants. For this problem, consider Y a consonant.",
        pre_code: "# For testing your function\n" +
            "print(count_capital_consonants(\"Georgia Tech\"))\n" +
            "print(count_capital_consonants(\"GEORGIA TECH\"))\n" +
            "print(count_capital_consonants(\"gEOrgIA tEch\"))",
    }
];

var annotation_time_total = 60;
var annotation_time_left = annotation_time_total;

$(document).ready(function (){
    randomQuestion();
    displayAnnotation();
    getSelection();
    startCountdown();
    makeAnnotation();
    closeToast();
    keyboardOverride();
});

function closeToast() {
    $("#toast-container .btn-close").click(function (){
        $("#toast-container #toast").hide();
    })
}

function randomQuestion() {
    const q = questions[Math.floor(Math.random()*questions.length)];
    $("div#problem-detail p").text("Problem " + q.idx + ": " + q.problem_detail);
    $("textarea#code").text(q.pre_code);
}

// Style each annotation button
// function styleAnnotation(a) {
//     $("div#annotation #" + a.id).css({
//         "background-color": a.color,
//         "border": a.color,
//     }).hover( function () {
//         $(this).css({
//             "background-color": a.color,
//             "border": a.color,
//         })
//     });
// }

// Display annotation button options.
function displayAnnotation() {
    const button_class_100 = "btn btn-success w-100";
    const button_class_50 = "btn btn-success w-50";
    for (const a of annotations) {
        $("#annotation").append("<button id=\"anno"+ a.idx + "\" class = \"" +
            ((a.idx === 9 || a.idx === 0)?button_class_50:button_class_100) +
            "\">" + a.idx + ". " + a.thought +
            "</button>");
        // styleAnnotation(a);
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
    $("#toast-container .toast-body span.text-success").text(a.text() + ": ");
    $("#toast-container .toast-body span.text-body").text(selection.toString());
    $("#toast-container #toast").show().delay(2000).fadeOut();

    // Textarea remove readonly
    $("textarea#code").attr("readonly", false);
    // Timer reset
    reset_time = true;
    // Stop animation for instant resetting
    $("div#countdown-timer div.progress-bar").stop(true, true);
}

// Make annotation with button click
function makeAnnotation() {
    $("div#annotation button").click(function(event) {
        event.stopPropagation();
        // Get corresponding annotation button
        let a = $(this);
        handleAnnotation(a);

        // Remove potential warning messages.
        // $("ul.messages").remove();
        $(".alert").alert('close');
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
        let warning = "Please make an annotation before continuing editing.";
        warningPrompt([warning]);
        // alert(warning);
        $("textarea#code").attr("readonly", true);
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

    if (!KEYBOARD_SHORTCUT_ENABLED) return;

    // Keyboard annotation short cut
    $(document).keypress(function(event) {
        let key_codes = range(48, 58); // key 0 to key 9
        // if(key_codes.includes(event.keyCode)) {
        //     if (event.altKey) {
        //         event.preventDefault();
        //         // event.preventDefault();
        //         // Get corresponding annotation button
        //         let a = $("div#annotation button#anno" + key_codes.indexOf(event.keyCode));
        //         console.log(a.text());
        //         handleAnnotation(a);
        //     }
        // }

        if((event.altKey || event.ctrlKey)
            && key_codes.includes(event.keyCode)) {
            event.preventDefault();
            // Get corresponding annotation button
            let a = $("div#annotation button#anno" + key_codes.indexOf(event.keyCode));
            console.log(a.text());
            handleAnnotation(a);
        }
    });
}

// Submit skulpt code
function skulptOutput(text) {
    // let output = document.getElementById("output");
    // output.innerHTML = output.innerHTML + text;
    let output = $("pre#output");
    output.html(output.html() + text);
}

function skulptBuiltinRead(x) {
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
    Sk.configure({output:skulptOutput, read:skulptBuiltinRead});
    // (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
    let myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, code, true);
    });
    myPromise.then(function(mod) {
       console.log('success');
    },
        function(err) {
            if (!PYTHON_ERROR_MESSAGE_DISPLAY) return;
            console.log(err.toString());
            skulptOutput(err.toString());
    });
}

function warningPrompt(messages) {
    $("html, body").scrollTop(0);
    // $("<ul class=\"messages\"><li class=\"warning\">" + messages + "</li></ul>").insertBefore($("div#header")).delay(5000).fadeOut("slow");
    // $("ul.messages").remove();
    // $("<ul class=\"messages\"></ul>").insertBefore($("body header"));
    // for (let message of messages) {
    //     $("ul.messages").append("<li class=\"warning\">" + message + "</li>");
    // }
    $(".alert").alert('close');
    $("<div class=\"alert alert-danger\" role=\"alert\">" + messages + "</div>").insertBefore($("body header"));
}