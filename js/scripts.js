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

$(document).ready(function (){
    displayAnnotation();
    monitorSelection();
    makeAnnotation();
});

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
let selection = "";
function getSelection() {
    selection = document.getSelection();
    // if (selection.toString() !== "") {
    //     console.log(selection.toString());
    // }
}

// Monitor text selection
function monitorSelection() {
    $(document).mouseup(getSelection);
}

// Make annotation of text selection
function makeAnnotation() {
    $("div#annotation button").click(function() {
        console.log({"thought": $(this).text(), "focus":selection.toString()});
        // let color = $(this).css("background-color");
        // let span = document.createElement("span");
        // selection.getRangeAt(0).surroundContents(span);
    });
}

// Submit skulpt code
function outf(text) {
    let output = document.getElementById("output");
    output.innerHTML = output.innerHTML + text;
}


function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

// Run the code in editor
function runPythonCode() {
    let code = document.getElementById("code").value;
    let output = document.getElementById("output");
    output.innerHTML = '';
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
