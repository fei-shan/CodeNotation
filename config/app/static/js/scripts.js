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
        question_detail: "Fibonacci's sequence is a sequence of numbers where every number is the sum of the previous two numbers, starting with 0, 1, 1, ... Given an integer input n, please write a function to calculate and return the nth Fibonacci number.",
        pre_code: "#For testing your function\n" +
            "print(Fibonacci(1)) #0\n" +
            "print(Fibonacci(4)) #2\n" +
            "print(Fibonacci(10)) #34",
    },
    {
        "idx" : 2,
        question_detail: "Write a function called count_capital_consonants. This function should take as input a string, and return as output a single integer. The number the function returns should be the count of characters from the string that were capital consonants. For this problem, consider Y a consonant.",
        pre_code: "#For testing your function\n" +
            "print(count_capital_consonants(\"Georgia Tech\")) #2\n" +
            "print(count_capital_consonants(\"GEORGIA TECH\")) #6\n" +
            "print(count_capital_consonants(\"gEOrgIA tEch\")) #0",
    }
];

var annotation_time_total = 60;
var annotation_time_left = annotation_time_total;

$(document).ready(function (){
    // randomQuestion();
    // leaveWarning();
    displayCodeMirror();
    displayAnnotation();
    getSelection();
    startCountdown();
    makeAnnotation();
    closeToast();
    keyboardOverride();
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function leaveWarning() {
    if (!$("#editor-field form").length) return;
    $(window).bind('beforeunload', function(e){
        return true;
    });

    // $("textarea#code").data('serialize', $("textarea#code").text()); // On load save form current state
    // console.log($("textarea#code").data('serialize'));
    // $(window).bind('beforeunload', function(e){
    //     if ($("textarea#code").text()!==$("textarea#code").data('serialize')) {
    //         return true;
    //     }
    //     else {
    //         e = null;
    //     } // If form state change show warning box, else don't show it.
    // });
}

function closeToast() {
    $("#toast-container .btn-close").click(function (){
        $("#toast-container #toast").hide();
    })
}

function randomQuestion() {
    const q = questions[Math.floor(Math.random()*questions.length)];
    $("#question-detail").attr("data-question-id", q.idx)
    $("div#question-detail p").text("Problem " + q.idx + ": " + q.question_detail);
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
    $("form#editor-form").one("click", function (event) { // Start countdown
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
    console.log({"annotation": a.text(), "selection":selection.toString()});

    // Remove potential warning messages.
    // $("ul.messages").remove();
    $(".alert").alert('close');

    // Send to server
    const csrftoken = getCookie('csrftoken');
    const question_id = $('#question-detail').attr("data-question-id");
    const url= $('#annotation').attr("data-ajax-url");
    $.ajax({
        url: url,
        data: {
            question: question_id,
            annotation: a.text(),
            selection: selection.toString(),
            code: $('#code').val(),
        },
        type: "POST",
        dataType: "json",
        headers: {'X-CSRFToken': csrftoken},
        context: this,
    }).done(function(json) {
        if (json.success) {
            console.log(json.success);
        } else {
            console.log(json.error);
            alert("Error: " + json.error);
        }
    })
    .fail(function( xhr, status, errorThrown ) {
        alert( "Sorry, there was a problem!" );
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
    });

    // Display toast
    $("#toast-container .toast-body span.text-success").text(a.text() + ": ");
    $("#toast-container .toast-body span.text-body").text(selection.toString());
    $("#toast-container #toast").show().delay(2000).fadeOut();

    // Textarea remove readonly
    $("textarea#code").attr("readonly", false);
    // With CodeMirror
    if (cm) cm.setOption("readOnly", false);
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
        // With CodeMirror
        if (cm) cm.setOption("readOnly", true);
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
    let output = $("#output");
    output.html(output.html() + text);
}

function skulptBuiltinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}


// With CodeMirror
var textarea = document.getElementById('code');
if (textarea) var cm = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
    });
// if (cm) cm.setSize(null, null);
// Run the code in editor
function runPythonCode() {
    // let code = document.getElementById("code").value;
    // let output = document.getElementById("output");
    // output.innerHTML = '';

    // With CodeMirror
    if (cm) cm.save();

    let code = $("textarea#code").val();
    let output = $("#output");
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

function displayCodeMirror() {
    if (typeof textarea !== 'undefined') {
        $("div#editor-field .CodeMirror").addClass($("textarea#code").attr("class"));
    }
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